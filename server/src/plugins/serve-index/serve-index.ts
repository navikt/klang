import { getTraceContext } from '@app/helpers/trace-context';
import { indexFile } from '@app/index-file';
import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { API_PROXY_PLUGIN_ID } from '@app/plugins/api-proxy';
import { LOCAL_DEV_PLUGIN_ID } from '@app/plugins/local-dev';
import { viewCountCounter } from '@app/plugins/serve-index/counters';
import { getAnonymousPaths, getLoggedInPaths } from '@app/plugins/serve-index/get-paths';
import { validateToken } from '@navikt/oasis';
import type { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('serve-index');

const serveIndexHandler = async (_: FastifyRequest, reply: FastifyReply) => {
  viewCountCounter.inc();

  return reply.header('content-type', 'text/html').status(200).send(indexFile.indexFile);
};

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

/** Wonderwall adds the access token to the Authorization header when the user has a valid session. */
const redirectToLoginIfLoggedOut = async (req: FastifyRequest, reply: FastifyReply) => {
  if (await isLoggedIn(req)) {
    return;
  }

  return reply.redirect(`/oauth2/login?redirect=${encodeURIComponent(req.url)}`, 302);
};

interface ServeIndexPluginOptions {
  /** Redirect logged out users to login on logged-in pages. Requires Wonderwall, so only enabled when deployed. */
  requireLogin: boolean;
}

export const SERVE_INDEX_PLUGIN_ID = 'serve-index';

export const serveIndexPlugin = fastifyPlugin<ServeIndexPluginOptions>(
  async (app, { requireLogin }) => {
    const loggedInRouteOptions: RouteShorthandOptions = requireLogin ? { preHandler: redirectToLoginIfLoggedOut } : {};

    for (const path of getLoggedInPaths()) {
      app.get(path, loggedInRouteOptions, serveIndexHandler);
    }

    for (const path of getAnonymousPaths()) {
      app.get(path, serveIndexHandler);
    }
  },
  {
    fastify: '5',
    name: SERVE_INDEX_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, API_PROXY_PLUGIN_ID, LOCAL_DEV_PLUGIN_ID],
  },
);
