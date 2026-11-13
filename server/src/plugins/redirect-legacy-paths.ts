import { LOWER_CASE_INNSENDINGSYTELSER } from '@app/innsendingsytelser';
import { getLogger } from '@app/logger';
import { LANGUAGES, STEPS } from '@app/plugins/serve-index/segments';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export const REDIRECT_LEGACY_PATHS_PLUGIN_ID = 'redirect-legacy-paths';

const YTELSER = new Set(LOWER_CASE_INNSENDINGSYTELSER);

const isLanguage = (lang: string): boolean => LANGUAGES.some((l) => l === lang);

const log = getLogger('redirect-legacy-paths-plugin');

const getQuery = (url: string): string => {
  const index = url.indexOf('?');
  return index === -1 ? '' : url.slice(index);
};

interface LegacyParams {
  lang: string;
  type: string;
  ytelseOrTema: string;
  '*'?: string;
}

const redirectHandler = (req: FastifyRequest<{ Params: LegacyParams }>, reply: FastifyReply) => {
  const { type, ytelseOrTema } = req.params;
  const rest = req.params['*'] ?? '';
  const lang = req.params.lang.toLowerCase();
  const lowerCaseYtelseOrTema = ytelseOrTema.toLowerCase();

  // Prevents open redirects, e.g. `/%2Fexample.org/...` redirecting to `//example.org/...`.
  if (!isLanguage(lang)) {
    return reply.callNotFound();
  }

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
  const redirectPath = `/${lang}/${type}/${ytelse}${suffix}${getQuery(req.url)}`;

  log.info({ msg: 'Redirecting legacy path', data: { from_path: req.url, to_path: redirectPath } });

  return reply.redirect(redirectPath);
};

interface EttersendelseKlageParams {
  lang: string;
  ytelse: string;
  step?: string;
}

const isStep = (step: string): boolean => STEPS.some((s) => s === step);

const ettersendelseKlageRedirectHandler = (
  req: FastifyRequest<{ Params: EttersendelseKlageParams }>,
  reply: FastifyReply,
) => {
  const { ytelse, step } = req.params;
  const lang = req.params.lang.toLowerCase();
  const lowerCaseYtelse = ytelse.toLowerCase();
  const lowerCaseStep = step?.toLowerCase();

  if (!isLanguage(lang) || !YTELSER.has(lowerCaseYtelse) || (lowerCaseStep !== undefined && !isStep(lowerCaseStep))) {
    return reply.callNotFound();
  }

  const stepSuffix = lowerCaseStep === undefined ? '' : `/${lowerCaseStep}`;
  const redirectPath = `/${lang}/ettersendelse/${lowerCaseYtelse}${stepSuffix}${getQuery(req.url)}`;

  log.info({ msg: 'Redirecting legacy ettersendelse path', data: { from_path: req.url, to_path: redirectPath } });

  return reply.redirect(redirectPath);
};

export const redirectLegacyPathsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/:lang/ettersendelse/klage/:ytelse', ettersendelseKlageRedirectHandler);
    app.get('/:lang/ettersendelse/klage/:ytelse/:step', ettersendelseKlageRedirectHandler);
    app.get('/:lang/:type/uinnlogget/:ytelseOrTema', redirectHandler);
    app.get('/:lang/:type/uinnlogget/:ytelseOrTema/*', redirectHandler);
    app.get('/:lang/:type/ny/:ytelseOrTema', redirectHandler);
    app.get('/:lang/:type/ny/:ytelseOrTema/*', redirectHandler);
  },
  { fastify: '5', name: REDIRECT_LEGACY_PATHS_PLUGIN_ID },
);
