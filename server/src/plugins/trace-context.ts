import { readTraceContext, type TraceContext } from '@app/helpers/trace-context';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    traceContext: TraceContext | null;
  }
}

export const TRACE_CONTEXT_PLUGIN_ID = 'trace-context';

/**
 * Stores the trace context on the request while the request span exists.
 * @fastify/otel ends the span and removes it from the request in `onSend`,
 * so hooks and callbacks running after that (`onResponse`, streamed responses) need the stored copy.
 */
export const traceContextPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('traceContext', null);

    app.addHook('onRequest', async (req) => {
      req.traceContext = readTraceContext(req);
    });
  },
  { fastify: '5', name: TRACE_CONTEXT_PLUGIN_ID, dependencies: ['@fastify/otel'] },
);
