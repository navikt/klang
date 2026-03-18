import { describe, expect, it, mock } from 'bun:test';
import Fastify from 'fastify';

mock.module('@app/logger', () => ({
  // biome-ignore lint/suspicious/noEmptyBlockStatements: Don't want logs in tests
  getLogger: () => ({ info: () => {}, warn: () => {}, error: () => {} }),
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
        expect(res.statusCode).toBe(301);
        expect(res.headers.location).toBe('/nb/klage/dagpenger');
      });

      it(`should redirect /:lang/:type/${prefix}/:ytelse/* with trailing path`, async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/dagpenger/begrunnelse` });
        expect(res.statusCode).toBe(301);
        expect(res.headers.location).toBe('/nb/klage/dagpenger/begrunnelse');
      });

      it('should ignore tema', async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/ufo/uforetrygd` });
        expect(res.statusCode).toBe(301);
        expect(res.headers.location).toBe('/nb/klage/uforetrygd');
      });

      it('should ignore tema with trailing path', async () => {
        const app = await buildApp();
        const res = await app.inject({ method: 'GET', url: `/nb/klage/${prefix}/arbeid/dagpenger/begrunnelse` });
        expect(res.statusCode).toBe(301);
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

  describe('case insensitivity', () => {
    it('should lowercase ytelse', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/DAGPENGER' });
      expect(res.statusCode).toBe(301);
      expect(res.headers.location).toBe('/nb/klage/dagpenger');
    });

    it('should lowercase ytelse prefixed with tema', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/ufo/UFORETRYGD' });
      expect(res.statusCode).toBe(301);
      expect(res.headers.location).toBe('/nb/klage/uforetrygd');
    });
  });

  describe('query string', () => {
    it('should preserve query string in redirect', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/dagpenger?saksnummer=123' });
      expect(res.statusCode).toBe(301);
      expect(res.headers.location).toBe('/nb/klage/dagpenger?saksnummer=123');
    });

    it('should preserve query string with tema', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/nb/klage/uinnlogget/arbeid/dagpenger?saksnummer=123' });
      expect(res.statusCode).toBe(301);
      expect(res.headers.location).toBe('/nb/klage/dagpenger?saksnummer=123');
    });

    it('should preserve query string with tema and suffix', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'GET',
        url: '/nb/klage/uinnlogget/arbeid/dagpenger/begrunnelse?saksnummer=123',
      });
      expect(res.statusCode).toBe(301);
      expect(res.headers.location).toBe('/nb/klage/dagpenger/begrunnelse?saksnummer=123');
    });
  });
});
