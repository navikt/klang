import { NAV_KLAGE_URL_DEV, NAV_KLAGE_URL_PROD, isDeployed, isDeployedToProd } from '@app/config/env';
import { INNSENDINGSYTELSER, Innsendingsytelse } from '@app/innsendingsytelser';
import { getLogger } from '@app/logger';
import { html } from '@app/plugins/not-found/html';
import { overviewCss } from '@app/plugins/not-found/overview-css';
import { generateHtml } from '@app/plugins/not-found/overview-template';
import { externalRedirectCounter } from '@app/plugins/serve-index/counters';
import { removeSaksnummer } from '@app/plugins/serve-index/remove-saksnummer';
import { CASE_TYPES } from '@app/plugins/serve-index/segments';
import { SERVE_INDEX_PLUGIN_ID } from '@app/plugins/serve-index/serve-index';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('not-found-plugin');

export const NOT_FOUND_PLUGIN_ID = 'not-found';

const HARMLESS_NOT_FOUND_PATHS = ['/favicon.ico', '/'];

export const notFoundPlugin = fastifyPlugin(
  async (app) => {
    app.setNotFoundHandler((req, reply) => {
      if (isDeployedToProd) {
        const harmless = HARMLESS_NOT_FOUND_PATHS.includes(req.url);

        log[harmless ? 'debug' : 'warn']({
          msg: `Invalid URL. Redirecting to external URL ${NAV_KLAGE_URL_PROD}`,
          data: {
            url: req.url,
            referer: req.headers.referer ?? 'undefined',
            referrer: req.headers.referrer ?? 'undefined',
          },
        });

        externalRedirectCounter.inc({
          url: removeSaksnummer(req.url),
        });

        return reply.redirect(NAV_KLAGE_URL_PROD);
      }

      return reply.status(404).header('content-type', 'text/html').send(OVERVIEW_PAGE_HTML);
    });
  },
  { fastify: '5', name: NOT_FOUND_PLUGIN_ID, dependencies: [SERVE_INDEX_PLUGIN_ID] },
);

const createLink = (path: string, type: string) => html`<a class="capitalized link" href="${path}">${type}</a>`;

const getLinks = (ytelse: string): string[] =>
  CASE_TYPES.flatMap((type) => [
    createLink(`/nb/${type}/${ytelse}`, type),
    createLink(`/nb/ettersendelse/${type}/${ytelse}`, `Ettersendelse ${type}`),
  ]);

const HIDDEN_YTELSER = [
  Innsendingsytelse.FORSIKRING,
  Innsendingsytelse.HJELPEMIDLER_ORTOPEDISKE,
  Innsendingsytelse.MEDLEMSKAP,
];

const getRows = async (): Promise<string[][]> => {
  const nb = await getYtelseNames('nb');
  const nn = await getYtelseNames('nn');
  const en = await getYtelseNames('en');

  return INNSENDINGSYTELSER.filter((y) => !HIDDEN_YTELSER.includes(y)).map((ytelse) => [
    html`<td class="key-cell">${ytelse}</td>`,
    html`<td>
      <dl class="two-columns-grid">
        <dt>Bokmål:</dt><dd>${nb.find(({ id }) => id === ytelse)?.navn ?? ytelse}</dd>
        <dt>Nynorsk:</dt><dd>${nn.find(({ id }) => id === ytelse)?.navn ?? ytelse}</dd>
        <dt>Engelsk:</dt><dd>${en.find(({ id }) => id === ytelse)?.navn ?? ytelse}</dd>
      </dl>
    </td>`,
    html`<td><div class="two-columns-grid">${getLinks(ytelse).join('\n')}</div></td>`,
  ]);
};

const KODEVERK_DOMAIN = isDeployed ? 'http://klage-kodeverk-api' : 'https://klage-kodeverk-api.intern.dev.nav.no';

interface YtelseName {
  id: Innsendingsytelse;
  navn: string;
}

const isYtelsResponse = (data: unknown): data is YtelseName[] =>
  Array.isArray(data) &&
  data.every((item) => typeof item === 'object' && item !== null && 'id' in item && 'navn' in item);

const getYtelseNames = async (lang: 'nb' | 'nn' | 'en'): Promise<YtelseName[]> => {
  const res = await fetch(`${KODEVERK_DOMAIN}/kodeverk/innsendingsytelser/${lang}`);
  const data = await res.json();

  if (!isYtelsResponse(data)) {
    throw new Error('Invalid response from kodeverk-api');
  }

  return data;
};

const generateOverviewPage = async () => {
  const rowData = await getRows();

  return generateHtml({
    rows: rowData.map((row) => html`<tr>${row.join('')}</tr>`).join(''),
    css: overviewCss,
    url: NAV_KLAGE_URL_DEV,
  });
};

let OVERVIEW_PAGE_HTML: string | null = isDeployedToProd ? null : await generateOverviewPage();

if (!isDeployedToProd) {
  // Refresh the overview page.
  setInterval(
    async () => {
      try {
        const newHtml = await generateOverviewPage();

        if (newHtml !== OVERVIEW_PAGE_HTML) {
          OVERVIEW_PAGE_HTML = newHtml;
          log.debug({ msg: 'Successfully updated the Overview page' });
        } else {
          log.debug({ msg: 'Overview page is up to date' });
        }
      } catch (error) {
        log.error({ msg: 'Error generating overview page', error });
      }
    },
    5 * 60 * 1_000,
  );
}
