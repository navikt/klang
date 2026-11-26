import { isDeployed, isDeployedToProd, NAV_KLAGE_URL_DEV } from '@app/config/env';
import { indexFile } from '@app/index-file';
import { INNSENDINGSYTELSER, Innsendingsytelse } from '@app/innsendingsytelser';
import { getLogger } from '@app/logger';
import { html } from '@app/plugins/not-found/html';
import { overviewCss } from '@app/plugins/not-found/overview-css';
import { generateHtml } from '@app/plugins/not-found/overview-template';
import { notFoundCounter } from '@app/plugins/serve-index/counters';
import { removeSaksnummer } from '@app/plugins/serve-index/remove-saksnummer';
import { CASE_TYPES, getEttersendelsePath } from '@app/plugins/serve-index/segments';
import { SERVE_INDEX_PLUGIN_ID } from '@app/plugins/serve-index/serve-index';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('not-found-plugin');

export const NOT_FOUND_PLUGIN_ID = 'not-found';

const HARMLESS_NOT_FOUND_PATHS = ['/favicon.ico', '/apple-touch-icon.png', '/apple-touch-icon-precomposed.png', '/'];

const notFoundHandler = (req: FastifyRequest, reply: FastifyReply) => {
  const harmless = HARMLESS_NOT_FOUND_PATHS.includes(req.url);

  log[harmless ? 'debug' : 'warn']({
    msg: 'Invalid URL. Responding with 404 page.',
    data: {
      url: req.url,
      referer: req.headers.referer ?? 'undefined',
      referrer: req.headers.referrer ?? 'undefined',
    },
  });

  notFoundCounter.inc({
    url: removeSaksnummer(req.url),
  });

  // The frontend renders a 404 page with a link to nav.no/klage for unknown routes.
  return reply.status(404).header('content-type', 'text/html').send(indexFile.getIndexFile(404));
};

/** Shows an overview of all ytelser and case types on the front page. */
const overviewOrNotFoundHandler = (req: FastifyRequest, reply: FastifyReply) => {
  if (isFrontPage(req.url)) {
    return reply.status(404).header('content-type', 'text/html').send(OVERVIEW_PAGE_HTML);
  }

  return notFoundHandler(req, reply);
};

export const notFoundPlugin = fastifyPlugin(
  async (app) => {
    app.setNotFoundHandler(isDeployedToProd ? notFoundHandler : overviewOrNotFoundHandler);
  },
  { fastify: '5', name: NOT_FOUND_PLUGIN_ID, dependencies: [SERVE_INDEX_PLUGIN_ID] },
);

const isFrontPage = (url: string): boolean => url === '/' || url.startsWith('/?');

const createLink = (path: string, type: string) => html`<a class="capitalized link" href="${path}">${type}</a>`;

const getLinks = (ytelse: string): string[] =>
  CASE_TYPES.flatMap((type) => [
    createLink(`/nb/${type}/${ytelse}`, type),
    createLink(`/nb/${getEttersendelsePath(type)}/${ytelse}`, `Ettersendelse ${type}`),
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
