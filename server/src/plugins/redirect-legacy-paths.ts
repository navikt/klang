import { LOWER_CASE_INNSENDINGSYTELSER } from '@app/innsendingsytelser';
import { getLogger } from '@app/logger';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export const REDIRECT_LEGACY_PATHS_PLUGIN_ID = 'redirect-legacy-paths';

const YTELSER = new Set(LOWER_CASE_INNSENDINGSYTELSER);

const log = getLogger('redirect-legacy-paths-plugin');

interface LegacyParams {
  lang: string;
  type: string;
  ytelse: string;
  '*'?: string;
}

const redirectHandler = (req: FastifyRequest<{ Params: LegacyParams }>, reply: FastifyReply) => {
  const { lang, type, ytelse } = req.params;
  const lowerCaseYtelse = ytelse.toLowerCase();

  if (!YTELSER.has(lowerCaseYtelse)) {
    return reply.callNotFound();
  }

  const rest = req.params['*'];
  const suffix = rest ? `/${rest}` : '';
  const [, queryString] = req.url.split('?');
  const query = queryString === undefined ? '' : `?${queryString}`;
  const redirectPath = `/${lang}/${type}/${lowerCaseYtelse}${suffix}${query}`;

  log.info({ msg: 'Redirecting legacy path', data: { from_path: req.url, to_path: redirectPath } });

  return reply.redirect(redirectPath, 301);
};

export const redirectLegacyPathsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/:lang/:type/uinnlogget/:ytelse', redirectHandler);
    app.get('/:lang/:type/uinnlogget/:ytelse/*', redirectHandler);
  },
  { fastify: '5', name: REDIRECT_LEGACY_PATHS_PLUGIN_ID },
);
