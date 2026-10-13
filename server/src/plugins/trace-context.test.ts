import { describe, expect, it } from 'bun:test';
import { getTraceContext, readTraceContext, type TraceContext } from '@app/helpers/trace-context';
import { traceContextPlugin } from '@app/plugins/trace-context';
import { FastifyOtelInstrumentation } from '@fastify/otel';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import Fastify from 'fastify';

const TRACE_ID_REGEX = /^[0-9a-f]{32}$/;
const SPAN_ID_REGEX = /^[0-9a-f]{16}$/;

describe('trace-context plugin', () => {
  it('should keep the trace context in onResponse, after the OTel span is cleared', async () => {
    const instrumentation = new FastifyOtelInstrumentation();
    instrumentation.setTracerProvider(new NodeTracerProvider());

    const app = Fastify();
    await app.register(instrumentation.plugin());
    await app.register(traceContextPlugin);

    let onRequest: TraceContext | undefined;
    let onResponse: TraceContext | undefined;
    let spanCleared = false;

    app.addHook('onRequest', async (req) => {
      onRequest = readTraceContext(req);
    });

    app.addHook('onResponse', async (req) => {
      spanCleared = req.opentelemetry().span === null;
      onResponse = getTraceContext(req);
    });

    app.get('/', async () => 'ok');

    await app.inject({ method: 'GET', url: '/' });

    expect(onRequest?.trace_id).toMatch(TRACE_ID_REGEX);
    expect(onRequest?.span_id).toMatch(SPAN_ID_REGEX);
    expect(spanCleared).toBe(true); // If this starts failing, the OTel span is no longer cleared and this plugin might not be needed anymore.
    expect(onResponse).toEqual(onRequest);
  });
});
