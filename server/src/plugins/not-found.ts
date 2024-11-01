import { YTELSE_OVERVIEW_URL, isDeployedToProd } from '@app/config/env';
import { INNSENDINGSYTELSER } from '@app/innsendingsytelser';
import { getLogger } from '@app/logger';
import { externalRedirectCounter } from '@app/plugins/serve-index/counters';
import { removeSaksnummer } from '@app/plugins/serve-index/remove-saksnummer';
import { CASE_TYPES } from '@app/plugins/serve-index/segments';
import { SERVE_INDEX_PLUGIN_ID } from '@app/plugins/serve-index/serve-index';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('not-found-plugin');

export const NOT_FOUND_PLUGIN_ID = 'not-found';

export const notFoundPlugin = fastifyPlugin(
  async (app) => {
    app.setNotFoundHandler((req, reply) => {
      if (isDeployedToProd) {
        log.warn({
          msg: `Invalid URL. Redirecting to external URL ${YTELSE_OVERVIEW_URL}`,
          data: { url: req.url },
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

const getCells = (ytelse: string): string[] =>
  CASE_TYPES.flatMap((type) => [
    createCell(`/nb/${type}/${ytelse}`, type),
    createCell(`/nb/ettersendelse/${type}/${ytelse}`, `${type} ettersendelse`),
  ]);

const createCell = (path: string, type: string) => `<td class="path"><a href="${path}">${type}</a></td>`;

const getRows = (): string[][] =>
  INNSENDINGSYTELSER.map((ytelse) => [
    `<td class="ytelse">${ytelse.toLowerCase().replaceAll('_', ' ')}</td>`,
    ...getCells(ytelse),
  ]);

const DEV_404_HTML = isDeployedToProd
  ? ''
  : `
    <html>
      <head>
        <title>404 - Siden finnes ikke</title>
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

          tr:hover {
            background-color: #f8f8f8;
          }

          th, td {
            padding: 0.25rem;
            overflow: hidden;
            white-space: normal;
            min-width: 160px;
          }

          th:first-letter, td:first-letter, td > a:first-letter {
            text-transform: uppercase;
          }

          td > a {
            background-color: #0067C5;
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 4px;
            display: block;
            width: 100%;
            white-space: nowrap;
          }

          td > a:hover {
            background-color: #0056B4;
          }

          td > a:active {
            background-color: #00459C;
          }

          td > a:visited {
            background-color: #634689;
          }

          td > a:visited:hover {
            background-color: #523874;
          }

          td > a:visited:active {
            background-color: #412B5D;
          }

          .path {
            text-align: left;
          }

          .ytelse {
            text-align: left;
            padding-right: 1rem;
            max-width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        </style>
      </head>
      <body>
        <h1>Siden finnes ikke</h1>
        <p>I produksjon ville du ha blitt videresendt til denne siden <a href="${YTELSE_OVERVIEW_URL}">${YTELSE_OVERVIEW_URL}</a>.</p>
        <h2>Tilgjengelige skjemaer</h2>
        <table>
          <thead>
            <tr>
              <th class="ytelse">Ytelse</th>
              ${CASE_TYPES.map((type) => `<th class="path">${type}</th><th class="path">${type} ettersendelse</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${getRows()
              .map((row) => `<tr>${row.join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `.trim();
