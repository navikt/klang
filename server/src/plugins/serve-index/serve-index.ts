import { redirectToLoginIfLoggedOut } from '@app/helpers/require-login';
import { indexFile } from '@app/index-file';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { API_PROXY_PLUGIN_ID } from '@app/plugins/api-proxy';
import { LOCAL_DEV_PLUGIN_ID } from '@app/plugins/local-dev';
import { viewCountCounter } from '@app/plugins/serve-index/counters';
import { getAnonymousPaths, getLoggedInPaths } from '@app/plugins/serve-index/get-paths';
import type { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const serveIndexHandler = async (_: FastifyRequest, reply: FastifyReply) => {
  viewCountCounter.inc();

  return reply.header('content-type', 'text/html').status(200).send(indexFile.getIndexFile(200));
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
