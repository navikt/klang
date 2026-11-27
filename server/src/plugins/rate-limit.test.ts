import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import Fastify, { type InjectOptions } from 'fastify';

process.env.NAIS_CLUSTER_NAME = 'local';

const noop = () => undefined;
const logger = { debug: noop, info: noop, warn: noop, error: noop };

mock.module('@app/logger', () => ({
  getLogger: () => logger,
  getTeamLogger: () => logger,
  isSerializable: () => true,
}));

const { rateLimitPlugin } = await import('@app/plugins/rate-limit');
const { frontendLogPlugin } = await import('@app/plugins/frontend-log/frontend-log');
const { errorReportPlugin } = await import('@app/plugins/error-report');
const { unleashProxyPlugin } = await import('@app/plugins/unleash-proxy');

const buildApp = async () => {
  const app = Fastify();
  app.decorateRequest('traceContext', null);
  app.decorateRequest('client_version', '');
  app.addHook('onRequest', async (req) => {
    req.traceContext = { trace_id: '', span_id: '' };
  });
  await app.register(rateLimitPlugin);
  await app.register(frontendLogPlugin);
  await app.register(errorReportPlugin);
  await app.register(unleashProxyPlugin);

  return app;
};

describe('rate limit', () => {
  afterEach(() => {
    mock.restore();
  });

  it.each<[InjectOptions, number]>([
    [{ method: 'POST', url: '/frontend-log', payload: {} }, 120],
    [{ method: 'POST', url: '/frontend-team-log', payload: {} }, 120],
    [{ method: 'POST', url: '/error-report', payload: {} }, 120],
    [{ method: 'GET', url: '/feature-toggle/some-toggle' }, 60],
  ])('should respond with 429 and Retry-After when %o exceeds %p requests per minute', async (request, max) => {
    spyOn(globalThis, 'fetch').mockImplementation(
      Object.assign(async () => Response.json({ enabled: true }), { preconnect: globalThis.fetch.preconnect }),
    );
    const app = await buildApp();

    const responses = await Promise.all(Array.from({ length: max + 1 }, () => app.inject(request)));
    const limited = responses.filter((res) => res.statusCode === 429);

    expect(limited).toHaveLength(1);
    expect(limited[0]?.headers['retry-after']).toBeDefined();
    expect(limited[0]?.json()).toMatchObject({ statusCode: 429, message: 'Rate limit exceeded' });
  });
});
