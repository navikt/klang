import { YTELSE_OVERVIEW_URL, isDeployed, isDeployedToProd } from '@app/config/env';
import { INNSENDINGSYTELSER, Innsendingsytelse } from '@app/innsendingsytelser';
import { getLogger } from '@app/logger';
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
          msg: `Invalid URL. Redirecting to external URL ${YTELSE_OVERVIEW_URL}`,
          data: {
            url: req.url,
            referer: req.headers.referer ?? 'undefined',
            referrer: req.headers.referrer ?? 'undefined',
          },
        });

        externalRedirectCounter.inc({
          url: removeSaksnummer(req.url),
        });

        return reply.redirect(YTELSE_OVERVIEW_URL);
      }

      return reply.status(404).header('content-type', 'text/html').send(DEV_404_HTML);
    });
  },
  { fastify: '5', name: NOT_FOUND_PLUGIN_ID, dependencies: [SERVE_INDEX_PLUGIN_ID] },
);

const createLink = (path: string, type: string) => `<a class="capitalized link" href="${path}">${type}</a>`;

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
    `<td class="key-cell">${ytelse}</td>`,
    `<td>
      <dl class="two-columns-grid">
        <dt>Bokmål:</dt><dd>${nb.find(({ id }) => id === ytelse)?.navn ?? ytelse}</dd>
        <dt>Nynorsk:</dt><dd>${nn.find(({ id }) => id === ytelse)?.navn ?? ytelse}</dd>
        <dt>Engelsk:</dt><dd>${en.find(({ id }) => id === ytelse)?.navn ?? ytelse}</dd>
      </dl>
    </td>`,
    `<td><div class="two-columns-grid">${getLinks(ytelse).join('\n')}</div></td>`,
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

const DEV_404_HTML = isDeployedToProd
  ? ''
  : `
    <html lang="no">
      <head>
        <title>DEV - Velg ytelse</title>
        <meta charset="utf-8">
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
          }

          body {
            font-family: sans-serif;
            margin: 2rem;
            margin-bottom: 8rem;
          }

          table {
            border-collapse: collapse;
            max-width: 100%;
          }

          tbody tr:nth-child(odd) {
            background-color: #F2F3F5;
          }

          tbody tr:hover {
            background-color: #ECEEF0;
          }

          th {
            font-size: 1.25rem;
            font-weight: bold;
          }

          th, td {
            padding-block: 0.75rem;
            padding-inline: 0.25rem;
            overflow: hidden;
            white-space: nowrap;
          }

          .link {
            background-color: #0067C5;
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 4px;
            display: block;
            width: 100%;
            white-space: nowrap;
          }

          .link:hover {
            background-color: #0056B4;
          }

          .link:active {
            background-color: #00459C;
          }

          .link:visited {
            background-color: #634689;
          }

          .link:visited:hover {
            background-color: #523874;
          }

          .link:visited:active {
            background-color: #412B5D;
          }

          .ytelse {
            text-align: left;
            padding-right: 1rem;
            max-width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .text-left {
            text-align: left;
          }

          .capitalized:not(:first-letter) {
            text-transform: lowercase;
          }

          .capitalized:first-letter {
            text-transform: uppercase;
          }

          .key-cell {
            text-align: left;
            max-width: 650px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: monospace;
            font-size: 1rem;
          }

          .key-cell:hover {
            max-width: unset;
          }

          dt {
            font-weight: bold;
          }

          dd {
            margin: 0;
          }

          .two-columns-grid {
            display: grid;
            grid-template-columns: min-content min-content;
            margin: 0;
            grid-gap: .25rem;
          }
        </style>
      </head>
      <body>
        <h1>Siden finnes ikke</h1>
        <p>I produksjon ville du ha blitt videresendt til denne siden: <a href="${YTELSE_OVERVIEW_URL}">${YTELSE_OVERVIEW_URL}</a>.</p>
        <h2>Tilgjengelige skjemaer</h2>
        <table>
          <thead>
            <tr>
              <th colspan="2" class="ytelse">Ytelse</th>
              <th class="text-left">Lenker</th>
            </tr>
          </thead>
          <tbody>
            ${(await getRows()).map((row) => `<tr>${row.join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `.trim();
