import { FastifyOtelInstrumentation } from '@fastify/otel';
import { type Context, SpanStatusCode } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NetInstrumentation } from '@opentelemetry/instrumentation-net';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, type ReadableSpan, type Span, type SpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export const fastifyOtelInstrumentation = new FastifyOtelInstrumentation();

const exporter = new OTLPTraceExporter();

/**
 * Downgrades undici AbortError spans from ERROR to OK.
 *
 * When a client disconnects during a proxied request, undici throws an AbortError
 * and `@opentelemetry/instrumentation-undici` unconditionally marks the span as ERROR.
 * Client disconnects are expected and should not be treated as errors.
 */
class AbortErrorSpanProcessor implements SpanProcessor {
  private readonly delegate: SpanProcessor;

  constructor(delegate: SpanProcessor) {
    this.delegate = delegate;
  }

  onStart(span: Span, parentContext: Context): void {
    this.delegate.onStart(span, parentContext);
  }

  onEnding(span: Span): void {
    this.delegate.onEnding?.(span);
  }

  onEnd(span: ReadableSpan): void {
    if (isAbortError(span)) {
      this.delegate.onEnd({
        ...span,
        status: { code: SpanStatusCode.OK, message: 'Client disconnected' },
      });

      return;
    }

    this.delegate.onEnd(span);
  }

  forceFlush(): Promise<void> {
    return this.delegate.forceFlush();
  }

  shutdown(): Promise<void> {
    return this.delegate.shutdown();
  }
}

/** Checks if the span is an undici AbortError (UND_ERR_ABORTED). */
const isAbortError = (span: ReadableSpan): boolean =>
  span.status.code === SpanStatusCode.ERROR &&
  span.events.some((e) => e.name === 'exception' && e.attributes?.['exception.type'] === 'UND_ERR_ABORTED');

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'klang-frontend-bff',
  }),
  spanProcessor: new AbortErrorSpanProcessor(new BatchSpanProcessor(exporter)),
  instrumentations: [
    new DnsInstrumentation(),
    new HttpInstrumentation(),
    new NetInstrumentation(),
    new UndiciInstrumentation(),
    fastifyOtelInstrumentation,
  ],
});

sdk.start();

export const shutdownTracing = () => sdk.shutdown();
