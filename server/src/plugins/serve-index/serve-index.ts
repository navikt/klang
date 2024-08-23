import { indexFile } from '@app/index-file';
import { API_PROXY_PLUGIN_ID } from '@app/plugins/api-proxy';
import { LOCAL_DEV_PLUGIN_ID } from '@app/plugins/local-dev';
import { viewCountCounter } from '@app/plugins/serve-index/counters';
import { getAnonymousPaths, getLoggedInPaths } from '@app/plugins/serve-index/get-paths';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const serveIndexHandler = async (_: FastifyRequest, reply: FastifyReply) => {
  viewCountCounter.inc();

  return reply.header('content-type', 'text/html').status(200).send(indexFile.indexFile);
};

export const SERVE_INDEX_PLUGIN_ID = 'serve-index';

export const serveIndexPlugin = fastifyPlugin(
  async (app) => {
    for (const path of getLoggedInPaths()) {
      app.get(path, serveIndexHandler);
    }

    for (const path of getAnonymousPaths()) {
      app.get(path, serveIndexHandler);
    }
  },
  { fastify: '4', name: SERVE_INDEX_PLUGIN_ID, dependencies: [API_PROXY_PLUGIN_ID, LOCAL_DEV_PLUGIN_ID] },
);
