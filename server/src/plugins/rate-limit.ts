import { getTraceContext } from '@app/helpers/trace-context';
import { getLogger } from '@app/logger';
import rateLimit from '@fastify/rate-limit';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('rate-limit');

export const RATE_LIMIT_PLUGIN_ID = 'rate-limit';

/** Thrown when a client exceeds the rate limit. Fastify responds with 429 and a JSON body, unless the route handles it. */
export class RateLimitError extends Error {
  public readonly statusCode = 429;

  constructor() {
    super('Rate limit exceeded');
  }
}

/**
 * Rate limits per IP address. Only applies to routes with `config.rateLimit`.
 * The limits are per pod, as the store is in memory.
 */
export const rateLimitPlugin = fastifyPlugin(
  async (app) => {
    await app.register(rateLimit, {
      global: false,
      errorResponseBuilder: () => new RateLimitError(),
      onExceeded: (req) =>
        log.warn({ msg: `Rate limit exceeded for ${req.method} ${req.routeOptions.url}`, ...getTraceContext(req) }),
    });
  },
  { fastify: '5', name: RATE_LIMIT_PLUGIN_ID },
);
