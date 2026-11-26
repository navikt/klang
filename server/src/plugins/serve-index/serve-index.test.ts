import { describe, expect, it, mock } from 'bun:test';
import Fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const INDEX_HTML = '<html>index</html>';
const API_PROXY_PLUGIN_ID = 'api-proxy';
const LOCAL_DEV_PLUGIN_ID = 'local-dev';

const VALID_TOKEN = 'valid-token';

mock.module('@app/logger', () => ({
  getLogger: () => ({ debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined }),
}));
const { getToken } = await import('@navikt/oasis');

mock.module('@navikt/oasis', () => ({
  getToken,
  validateToken: async (token: string) =>
    token === VALID_TOKEN ? { ok: true } : { ok: false, error: new Error('Invalid token') },
}));
mock.module('@app/index-file', () => ({ indexFile: { indexFile: INDEX_HTML } }));
mock.module('@app/plugins/serve-index/counters', () => ({ viewCountCounter: { inc: () => undefined } }));
mock.module('@app/plugins/api-proxy', () => ({ API_PROXY_PLUGIN_ID }));
mock.module('@app/plugins/local-dev', () => ({ LOCAL_DEV_PLUGIN_ID }));

const { serveIndexPlugin } = await import('./serve-index');
const { accessTokenPlugin } = await import('@app/plugins/access-token');

const buildApp = async () => {
  const app = Fastify();
  app.decorateRequest('traceContext', null);
  app.addHook('onRequest', async (req) => {
    req.traceContext = { trace_id: '', span_id: '' };
  });
  await app.register(accessTokenPlugin);
  await app.register(fastifyPlugin(async () => undefined, { name: API_PROXY_PLUGIN_ID }));
  await app.register(fastifyPlugin(async () => undefined, { name: LOCAL_DEV_PLUGIN_ID }));
  await app.register(serveIndexPlugin, { requireLogin: true });
  return app;
};

describe('serve-index', () => {
  it('should redirect logged-in pages to login when there is no access token', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/nb/sak/123/begrunnelse?foo=bar' });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/oauth2/login?redirect=%2Fnb%2Fsak%2F123%2Fbegrunnelse%3Ffoo%3Dbar');
  });

  it('should redirect logged-in pages to login when the access token is invalid', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/nb/sak/123', headers: { authorization: 'Bearer invalid' } });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/oauth2/login?redirect=%2Fnb%2Fsak%2F123');
  });

  it('should serve logged-in pages when the access token is valid', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/nb/sak/123',
      headers: { authorization: `Bearer ${VALID_TOKEN}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(INDEX_HTML);
  });

  it('should serve anonymous pages without an access token', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/nb/klage/dagpenger' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(INDEX_HTML);
  });
});
