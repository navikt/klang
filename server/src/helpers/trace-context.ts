import type { Span } from '@opentelemetry/api';
import type { FastifyRequest, RawServerBase, RawServerDefault, RequestGenericInterface } from 'fastify';

export interface TraceContext {
  trace_id: string;
  span_id: string;
}

type Request = FastifyRequest<RequestGenericInterface, RawServerBase | RawServerDefault>;

const EMPTY_TRACE_CONTEXT: TraceContext = { trace_id: '', span_id: '' };

/** Returns the trace context stored by the trace context plugin, or reads it from the request span. */
export const getTraceContext = (req: Request): TraceContext => req.traceContext ?? readTraceContext(req);

/** Reads the trace context from the request span. */
export const readTraceContext = (req: Request): TraceContext => {
  const otel = req.opentelemetry();

  // @fastify/otel sets the span to null in `onSend`, even though `enabled` stays true.
  const span: Span | null = otel.span;

  if (otel.enabled && span !== null) {
    const { traceId: trace_id, spanId: span_id } = span.spanContext();

    return { trace_id, span_id };
  }

  return EMPTY_TRACE_CONTEXT;
};
