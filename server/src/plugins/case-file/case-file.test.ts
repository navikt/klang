import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import type { AddressInfo } from 'node:net';
import Fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';

process.env.NAIS_CLUSTER_NAME = 'local';

const VALID_TOKEN = 'valid-token';
const OBO_TOKEN = 'obo-token';
const getIndexFile = (status: number | string) =>
  `<html data-status="${status}"><head><title>Klage</title></head></html>`;
const CASE_ID = 'f9e8d7c6-1234-4abc-9def-0123456789ab';
const ATTACHMENT_ID = '92c197cb-2677-4678-a345-e3c360990ce9';

mock.module('@app/logger', () => ({
  getLogger: () => ({ debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined }),
}));
const { getToken } = await import('@navikt/oasis');

mock.module('@navikt/oasis', () => ({
  getToken,
  validateToken: async (token: string) =>
    token === VALID_TOKEN ? { ok: true } : { ok: false, error: new Error('Invalid token') },
}));

mock.module('@app/index-file', () => ({ indexFile: { getIndexFile } }));

const { caseFilePlugin } = await import('./case-file');
const { accessTokenPlugin } = await import('@app/plugins/access-token');
const { OBO_ACCESS_TOKEN_PLUGIN_ID } = await import('@app/plugins/obo-token');
const { rateLimitPlugin } = await import('@app/plugins/rate-limit');

const fakeOboPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('getOboAccessToken', async () => OBO_TOKEN);
    app.decorateRequest('getCachedOboAccessToken', () => OBO_TOKEN);
  },
  { name: OBO_ACCESS_TOKEN_PLUGIN_ID },
);

const buildApp = async (requireLogin = false, oboPlugin = fakeOboPlugin) => {
  const app = Fastify();
  app.decorateRequest('traceContext', null);
  app.decorateRequest('client_version', '');
  app.addHook('onRequest', async (req) => {
    req.traceContext = { trace_id: '', span_id: '' };
  });
  await app.register(accessTokenPlugin);
  await app.register(oboPlugin);
  await app.register(rateLimitPlugin);
  await app.register(caseFilePlugin, { requireLogin });

  return app;
};

const mockFetch = (response: () => Response | Promise<Response>) =>
  spyOn(globalThis, 'fetch').mockImplementation(
    Object.assign(async () => response(), { preconnect: globalThis.fetch.preconnect }),
  );

const URL = `/nb/sak/${CASE_ID}/vedlegg/${ATTACHMENT_ID}`;

/** The real fetch, for making requests to the server while upstream fetch is mocked. */
const realFetch = globalThis.fetch;

describe('case-file', () => {
  afterEach(() => {
    mock.restore();
  });

  it('should stream the file inline with the upstream headers', async () => {
    const fetchSpy = mockFetch(
      () =>
        new Response('file-content', {
          headers: {
            'content-type': 'application/pdf',
            'content-length': '12',
            'content-disposition': 'attachment; filename="vedtak.pdf"',
          },
        }),
    );
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url: URL, headers: { authorization: `Bearer ${VALID_TOKEN}` } });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('file-content');
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-length']).toBe('12');
    expect(res.headers['content-disposition']).toBe('inline; filename="vedtak.pdf"');
    expect(res.headers['x-content-type-options']).toBe('nosniff');

    const [url, init] = fetchSpy.mock.calls[0] ?? [];
    expect(url).toBe(
      `https://klage.intern.dev.nav.no/api/klage-dittnav-api/api/klanker/${CASE_ID}/vedlegg/${ATTACHMENT_ID}`,
    );
    expect(new Headers(init?.headers).get('authorization')).toBe(`Bearer ${OBO_TOKEN}`);
  });

  it('should send the first chunk before the upstream body is complete', async () => {
    const { promise: upstreamDone, resolve: finishUpstream } = Promise.withResolvers<void>();
    const encoder = new TextEncoder();

    mockFetch(
      () =>
        new Response(
          new ReadableStream<Uint8Array>({
            start: async (controller) => {
              controller.enqueue(encoder.encode('first'));
              await upstreamDone;
              controller.enqueue(encoder.encode('last'));
              controller.close();
            },
          }),
          { headers: { 'content-type': 'application/pdf' } },
        ),
    );
    const app = await buildApp();
    await app.listen({ port: 0, host: '127.0.0.1' });
    const address = app.server.address();

    if (address === null || typeof address === 'string') {
      throw new Error('Expected server to listen on a port');
    }

    const { port }: AddressInfo = address;
    const res = await realFetch(`http://127.0.0.1:${port}${URL}`);
    const reader = res.body?.getReader();
    const first = await reader?.read();

    expect(new TextDecoder().decode(first?.value)).toBe('first');

    finishUpstream();
    await reader?.cancel();
    await app.close();
  });

  it('should abort the upstream request when the client disconnects during the token exchange', async () => {
    const { promise: oboStarted, resolve: startObo } = Promise.withResolvers<void>();
    const { promise: oboReleased, resolve: releaseObo } = Promise.withResolvers<void>();
    const { promise: upstreamCalled, resolve: callUpstream } = Promise.withResolvers<boolean>();

    const slowOboPlugin = fastifyPlugin(
      async (app) => {
        app.decorateRequest('getOboAccessToken', async () => {
          startObo();
          await oboReleased;
          return OBO_TOKEN;
        });
        app.decorateRequest('getCachedOboAccessToken', () => OBO_TOKEN);
      },
      { name: OBO_ACCESS_TOKEN_PLUGIN_ID },
    );

    spyOn(globalThis, 'fetch').mockImplementation(
      Object.assign(
        async (_: string | URL | Request, init?: RequestInit) => {
          callUpstream(init?.signal?.aborted ?? false);
          throw new DOMException('The operation was aborted.', 'AbortError');
        },
        { preconnect: globalThis.fetch.preconnect },
      ),
    );

    const app = await buildApp(false, slowOboPlugin);
    await app.listen({ port: 0, host: '127.0.0.1' });
    const address = app.server.address();

    if (address === null || typeof address === 'string') {
      throw new Error('Expected server to listen on a port');
    }

    const { port }: AddressInfo = address;
    const client = new AbortController();
    const request = realFetch(`http://127.0.0.1:${port}${URL}`, { signal: client.signal }).catch(() => undefined);

    await oboStarted;
    client.abort();
    await request;
    // Let the server observe the closed connection.
    await Bun.sleep(50);
    releaseObo();

    expect(await upstreamCalled).toBe(true);

    await app.close();
  });

  it.each([404, 410])('should serve the app with status %p when upstream responds with it', async (status) => {
    mockFetch(() => new Response('error', { status }));
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url: URL });

    expect(res.statusCode).toBe(status);
    expect(res.headers['content-type']).toBe('text/html');
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.body).toBe(getIndexFile(status));
  });

  it.each([
    [400, 400],
    [403, 403],
    [401, 'client_error'],
    [409, 'client_error'],
    [413, 'client_error'],
    [499, 'client_error'],
  ])('should forward client error %p and serve the app with data-status %p', async (status, dataStatus) => {
    mockFetch(() => new Response('error', { status }));
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url: URL });

    expect(res.statusCode).toBe(status);
    expect(res.body).toBe(getIndexFile(dataStatus));
  });

  it('should redirect to login when upstream responds with 401 and login is required', async () => {
    mockFetch(() => new Response('unauthorized', { status: 401 }));
    const app = await buildApp(true);

    const res = await app.inject({ method: 'GET', url: URL, headers: { authorization: `Bearer ${VALID_TOKEN}` } });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe(`/oauth2/login?redirect=${encodeURIComponent(`${URL}?login_attempt=1`)}`);
  });

  it('should serve the app with status 502 when upstream responds with 401 after login', async () => {
    mockFetch(() => new Response('unauthorized', { status: 401 }));
    const app = await buildApp(true);

    const res = await app.inject({
      method: 'GET',
      url: `${URL}?login_attempt=1`,
      headers: { authorization: `Bearer ${VALID_TOKEN}` },
    });

    expect(res.statusCode).toBe(502);
    expect(res.body).toBe(getIndexFile(502));
  });

  it.each([500, 503])('should serve the app with status 502 when upstream responds with %p', async (status) => {
    mockFetch(() => new Response('error', { status }));
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url: URL });

    expect(res.statusCode).toBe(502);
    expect(res.body).toBe(getIndexFile(502));
  });

  it('should serve the app with status 502 when the upstream request fails', async () => {
    mockFetch(() => {
      throw new TypeError('fetch failed');
    });
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url: URL });

    expect(res.statusCode).toBe(502);
    expect(res.body).toBe(getIndexFile(502));
  });

  it.each([[`/nb/sak/${CASE_ID}/vedlegg/abc.def`], [`/nb/sak/abc.def/vedlegg/${ATTACHMENT_ID}`]])(
    'should serve the app with status 404 without calling upstream for invalid IDs in %p',
    async (url) => {
      const fetchSpy = mockFetch(() => new Response('file'));
      const app = await buildApp();

      const res = await app.inject({ method: 'GET', url });

      expect(res.statusCode).toBe(404);
      expect(res.body).toBe(getIndexFile(404));
      expect(fetchSpy).not.toHaveBeenCalled();
    },
  );

  it.each([
    [`/nb/sak/${CASE_ID}/pdf`, `/api/klanker/${CASE_ID}/pdf`],
    [`/en/sak/${CASE_ID}/pdf/innsending`, `/api/klanker/${CASE_ID}/pdf/innsending`],
  ])('should stream the case PDF %p from %p', async (url, upstreamPath) => {
    const fetchSpy = mockFetch(
      () =>
        new Response('pdf-content', {
          headers: { 'content-type': 'application/pdf', 'content-disposition': 'attachment; filename="klage.pdf"' },
        }),
    );
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('pdf-content');
    expect(res.headers['content-disposition']).toBe('inline; filename="klage.pdf"');
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(`https://klage.intern.dev.nav.no/api/klage-dittnav-api${upstreamPath}`);
  });

  it('should serve the app with status 404 without calling upstream for invalid case IDs in PDF routes', async () => {
    const fetchSpy = mockFetch(() => new Response('file'));
    const app = await buildApp();

    const res = await app.inject({ method: 'GET', url: '/nb/sak/abc.def/pdf' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toBe(getIndexFile(404));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should serve the app with status 429 when the rate limit is exceeded', async () => {
    const fetchSpy = mockFetch(() => new Response('file'));
    const app = await buildApp();

    const responses = await Promise.all(Array.from({ length: 61 }, () => app.inject({ method: 'GET', url: URL })));
    const limited = responses.filter((res) => res.statusCode === 429);

    expect(limited).toHaveLength(1);
    expect(limited[0]?.body).toBe(getIndexFile('client_error'));
    expect(limited[0]?.headers['content-type']).toBe('text/html');
    expect(limited[0]?.headers['retry-after']).toBeDefined();
    expect(fetchSpy).toHaveBeenCalledTimes(60);
  });

  it('should redirect to login when login is required and the user is logged out', async () => {
    const fetchSpy = mockFetch(() => new Response('file'));
    const app = await buildApp(true);

    const res = await app.inject({ method: 'GET', url: URL });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe(`/oauth2/login?redirect=${encodeURIComponent(URL)}`);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
