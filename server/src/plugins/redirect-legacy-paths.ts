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
  ytelseOrTema: string;
  '*'?: string;
}

const redirectHandler = (req: FastifyRequest<{ Params: LegacyParams }>, reply: FastifyReply) => {
  const { lang, type, ytelseOrTema } = req.params;
  const rest = req.params['*'] ?? '';
  const lowerCaseYtelseOrTema = ytelseOrTema.toLowerCase();

  if (YTELSER.has(lowerCaseYtelseOrTema)) {
    return redirect(req, reply, lang, type, lowerCaseYtelseOrTema, rest);
  }

  const [firstSegment, ...remaining] = rest.split('/');

  if (firstSegment !== undefined && YTELSER.has(firstSegment.toLowerCase())) {
    return redirect(req, reply, lang, type, firstSegment.toLowerCase(), remaining.join('/'));
  }

  return reply.callNotFound();
};

const redirect = (
  req: FastifyRequest,
  reply: FastifyReply,
  lang: string,
  type: string,
  ytelse: string,
  rest: string,
) => {
  const suffix = rest ? `/${rest}` : '';
  const [, queryString] = req.url.split('?');
  const query = queryString === undefined ? '' : `?${queryString}`;
  const redirectPath = `/${lang}/${type}/${ytelse}${suffix}${query}`;

  log.info({ msg: 'Redirecting legacy path', data: { from_path: req.url, to_path: redirectPath } });

  return reply.redirect(redirectPath, 301);
};

export const redirectLegacyPathsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/:lang/:type/uinnlogget/:ytelseOrTema', redirectHandler);
    app.get('/:lang/:type/uinnlogget/:ytelseOrTema/*', redirectHandler);
    app.get('/:lang/:type/ny/:ytelseOrTema', redirectHandler);
    app.get('/:lang/:type/ny/:ytelseOrTema/*', redirectHandler);
  },
  { fastify: '5', name: REDIRECT_LEGACY_PATHS_PLUGIN_ID },
);
