import { html } from '@app/plugins/not-found/html';

interface Values {
  rows: string;
  css: string;
  url: string;
}

export const generateHtml = ({ css, rows, url }: Values) =>
  html`
<html lang="no">
  <head>
    <title>Oversikt over ytelser</title>
    <meta charset="utf-8">
    <style>
      ${css}
    </style>
  </head>
  <body>
    <h1>Oversikt over ytelser</h1>
    <p>I produksjon ville du ha blitt videresendt til denne siden: <a href="${url}">${url}</a>.</p>
    <table>
      <thead>
        <tr>
          <th colspan="2" class="ytelse">Ytelse</th>
          <th class="text-left">Lenker</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>
`;
