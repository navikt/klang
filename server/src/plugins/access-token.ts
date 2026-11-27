import { getToken } from '@navikt/oasis';
import fastifyPlugin from 'fastify-plugin';

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
      req.accessToken = getToken(req) ?? '';
    });
  },
  { fastify: '5', name: ACCESS_TOKEN_PLUGIN_ID },
);
