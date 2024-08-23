import { describe, expect, it } from 'bun:test';
import { getAnonymousPaths, getLoggedInPaths } from './get-paths';

const ANONYMOUS_PATHS = [
  '/nb/klage/DAGPENGER',
  '/nb/klage/DAGPENGER',
  '/nb/klage/DAGPENGER',
  '/nb/anke/DAGPENGER',
  '/nb/anke/DAGPENGER',
  '/nb/anke/DAGPENGER',
  '/nb/klage/DAGPENGER/begrunnelse',
  '/nb/klage/DAGPENGER/oppsummering',
  '/nb/klage/DAGPENGER/innsending',
  '/nb/anke/DAGPENGER/begrunnelse',
  '/nb/anke/DAGPENGER/oppsummering',
  '/nb/anke/DAGPENGER/innsending',
  '/nb/ettersendelse/klage/DAGPENGER',
  '/nb/ettersendelse/klage/DAGPENGER',
  '/nb/ettersendelse/klage/DAGPENGER',
  '/nb/ettersendelse/anke/DAGPENGER',
  '/nb/ettersendelse/anke/DAGPENGER',
  '/nb/ettersendelse/anke/DAGPENGER',
  '/nb/ettersendelse/klage/DAGPENGER/begrunnelse',
  '/nb/ettersendelse/klage/DAGPENGER/oppsummering',
  '/nb/ettersendelse/klage/DAGPENGER/innsending',
  '/nb/ettersendelse/anke/DAGPENGER/begrunnelse',
  '/nb/ettersendelse/anke/DAGPENGER/oppsummering',
  '/nb/ettersendelse/anke/DAGPENGER/innsending',
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
