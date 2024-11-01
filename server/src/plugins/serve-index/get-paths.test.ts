import { describe, expect, it } from 'bun:test';
import { getAnonymousPaths, getLoggedInPaths } from './get-paths';

const ANONYMOUS_PATHS = [
  '/nb/klage/dagpenger',
  '/nb/klage/dagpenger',
  '/nb/klage/dagpenger',
  '/nb/anke/dagpenger',
  '/nb/anke/dagpenger',
  '/nb/anke/dagpenger',
  '/nb/klage/dagpenger/begrunnelse',
  '/nb/klage/dagpenger/oppsummering',
  '/nb/klage/dagpenger/innsending',
  '/nb/anke/dagpenger/begrunnelse',
  '/nb/anke/dagpenger/oppsummering',
  '/nb/anke/dagpenger/innsending',
  '/nb/ettersendelse/klage/dagpenger',
  '/nb/ettersendelse/klage/dagpenger',
  '/nb/ettersendelse/klage/dagpenger',
  '/nb/ettersendelse/anke/dagpenger',
  '/nb/ettersendelse/anke/dagpenger',
  '/nb/ettersendelse/anke/dagpenger',
  '/nb/ettersendelse/klage/dagpenger/begrunnelse',
  '/nb/ettersendelse/klage/dagpenger/oppsummering',
  '/nb/ettersendelse/klage/dagpenger/innsending',
  '/nb/ettersendelse/anke/dagpenger/begrunnelse',
  '/nb/ettersendelse/anke/dagpenger/oppsummering',
  '/nb/ettersendelse/anke/dagpenger/innsending',
];

const LOGGED_IN_PATHS = [
  '/nb/sak/:id/begrunnelse',
  '/nb/sak/:id/oppsummering',
  '/nb/sak/:id/innsending',
  '/nb/sak/:id/kvittering',
  '/nn/sak/:id/begrunnelse',
  '/nn/sak/:id/oppsummering',
  '/nn/sak/:id/innsending',
  '/nn/sak/:id/kvittering',
  '/en/sak/:id/begrunnelse',
  '/en/sak/:id/oppsummering',
  '/en/sak/:id/innsending',
  '/en/sak/:id/kvittering',
];

describe('generate paths', () => {
  it('should include all known anonymous paths', async () => {
    expect.assertions(ANONYMOUS_PATHS.length + 1);

    const paths = getAnonymousPaths();

    // No duplicates.
    expect(paths).toBeArrayOfSize(new Set(paths).size);

    for (const url of ANONYMOUS_PATHS) {
      expect(paths).toContain(url);
    }
  });

  it('should include all known logged in paths', async () => {
    expect.assertions(LOGGED_IN_PATHS.length + 1);

    const paths = getLoggedInPaths();

    // No duplicates.
    expect(paths).toBeArrayOfSize(new Set(paths).size);

    for (const url of LOGGED_IN_PATHS) {
      expect(paths).toContain(url);
    }
  });
});
