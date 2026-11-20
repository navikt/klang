import { describe, expect, it, mock } from 'bun:test';
import Fastify from 'fastify';

mock.module('@app/logger', () => ({
  getLogger: () => ({ info: () => undefined, warn: () => undefined, error: () => undefined }),
}));

const { redirectLegacyPathsPlugin } = await import('./redirect-legacy-paths');

const buildApp = async () => {
  const app = Fastify();
  await app.register(redirectLegacyPathsPlugin);
  return app;
};

describe('redirect-legacy-paths', () => {
  for (const prefix of ['uinnlogget', 'ny']) {
    describe(prefix, () => {
      it(`should redirect /:lang/:type/${prefix}/:ytelse to /:lang/:type/:ytelse`, async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/dagpenger` });
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/nb/klage/dagpenger');
      });

      it(`should redirect /:lang/:type/${prefix}/:ytelse/* with trailing path`, async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/dagpenger/begrunnelse` });
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/nb/klage/dagpenger/begrunnelse');
      });

      it('should ignore tema', async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/ufo/uforetrygd` });
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/nb/klage/uforetrygd');
      });

      it('should ignore tema with trailing path', async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/arbeid/dagpenger/begrunnelse` });
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/nb/klage/dagpenger/begrunnelse');
      });

      it('should not redirect invalid ytelse', async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/ukjent` });
        expect(res.statusCode).toBe(404);
      });

      it('should not redirect when both ytelse and first wildcard segment are invalid', async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/ukjent/ogsa-ukjent` });
        expect(res.statusCode).toBe(404);
      });
    });
  }

  describe('ettersendelse/klage', () => {
    it('should redirect /:lang/ettersendelse/klage/:ytelse to /:lang/ettersendelse/:ytelse', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nn/ettersendelse/klage/dagpenger' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nn/ettersendelse/dagpenger');
    });

    it('should preserve trailing path and query string', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'GET',
        url: '/nb/ettersendelse/klage/dagpenger/begrunnelse?saksnummer=123&ka',
      });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/ettersendelse/dagpenger/begrunnelse?saksnummer=123&ka');
    });

    it('should lowercase ytelse', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/klage/DAGPENGER' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/ettersendelse/dagpenger');
    });

    it('should lowercase step', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/klage/dagpenger/BEGRUNNELSE' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/ettersendelse/dagpenger/begrunnelse');
    });

    it('should not redirect invalid ytelse', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/klage/ukjent' });
      expect(res.statusCode).toBe(404);
    });

    it('should not redirect invalid step', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/klage/dagpenger/ukjent' });
      expect(res.statusCode).toBe(404);
    });

    it('should not redirect without ytelse', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/klage' });
      expect(res.statusCode).toBe(404);
    });

    it('should not redirect ettersendelse/anke', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/anke/dagpenger' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('language', () => {
    for (const url of ['/%2Fexample.org/klage/uinnlogget/dagpenger', '/%2Fexample.org/ettersendelse/klage/dagpenger']) {
      it(`should not redirect to another host for ${url}`, async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url });
        expect(res.statusCode).toBe(404);
      });
    }

    it('should not redirect unknown language', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/de/ettersendelse/klage/dagpenger' });
      expect(res.statusCode).toBe(404);
    });

    it('should lowercase language', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/NB/klage/uinnlogget/dagpenger' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/dagpenger');
    });
  });

  describe('case insensitivity', () => {
    it('should lowercase ytelse', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/DAGPENGER' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/dagpenger');
    });

    it('should lowercase ytelse prefixed with tema', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/ufo/UFORETRYGD' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/uforetrygd');
    });
  });

  describe('query string', () => {
    it('should preserve query string in redirect', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/dagpenger?saksnummer=123' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/dagpenger?saksnummer=123');
    });

    it('should preserve query string containing question marks', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/dagpenger?saksnummer=123?456&ka' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/dagpenger?saksnummer=123?456&ka');
    });

    it('should preserve query string containing question marks for ettersendelse/klage', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/ettersendelse/klage/dagpenger?saksnummer=123?456&ka' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/ettersendelse/dagpenger?saksnummer=123?456&ka');
    });

    it('should preserve query string with tema', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/arbeid/dagpenger?saksnummer=123' });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/dagpenger?saksnummer=123');
    });

    it('should preserve query string with tema and suffix', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'GET',
        url: '/nb/klage/uinnlogget/arbeid/dagpenger/begrunnelse?saksnummer=123',
      });
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('/nb/klage/dagpenger/begrunnelse?saksnummer=123');
    });
  });
});
