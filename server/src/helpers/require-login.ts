import { getTraceContext } from '@app/helpers/trace-context';
import { getLogger } from '@app/logger';
import { validateToken } from '@navikt/oasis';
import type { FastifyReply, FastifyRequest } from 'fastify';

const log = getLogger('require-login');

const isLoggedIn = async (req: FastifyRequest): Promise<boolean> => {
  if (req.accessToken.length === 0) {
    return false;
  }

  const validation = await validateToken(req.accessToken);

  if (!validation.ok) {
    log.warn({ msg: 'Invalid access token. Redirecting to login.', ...getTraceContext(req), data: { url: req.url } });
  }

  return validation.ok;
};

/** Wonderwall login, redirecting back to the given URL after login. */
export const getLoginUrl = (redirectUrl: string): string => `/oauth2/login?redirect=${encodeURIComponent(redirectUrl)}`;

/** Wonderwall adds the access token to the Authorization header when the user has a valid session. */
export const redirectToLoginIfLoggedOut = async (req: FastifyRequest, reply: FastifyReply) => {
  if (await isLoggedIn(req)) {
    return;
  }

  return reply.redirect(getLoginUrl(req.url), 302);
};
