import { AUTHORIZATION_HEADER } from '@app/headers';
import { getTraceContext } from '@app/helpers/trace-context';
import { getLogger } from '@app/logger';
import type { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('access-token-plugin');

declare module 'fastify' {
  interface FastifyRequest {
    accessToken: string;
  }
}

export const ACCESS_TOKEN_PLUGIN_ID = 'access-token';

export const accessTokenPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('accessToken', '');

    app.addHook('preHandler', async (req) => {
      const accessToken = getAccessToken(req);

      if (accessToken !== undefined) {
        req.accessToken = accessToken;
      }
    });
  },
  { fastify: '5', name: ACCESS_TOKEN_PLUGIN_ID },
);

const getAccessToken = (req: FastifyRequest): string | undefined => {
  const authHeader = req.headers[AUTHORIZATION_HEADER];

  if (authHeader !== undefined) {
    log.debug({
      msg: `Found access token in Authorization header, length: ${authHeader.length}`,
      ...getTraceContext(req),
    });
    const [, accessToken] = authHeader.split(' ');

    return accessToken;
  }

  log.debug({ msg: 'No access token found in Authorization header', ...getTraceContext(req) });

  return undefined;
};
