import { oboCache } from '@app/auth/cache/cache';
import { getIsTokenXClientReady } from '@app/auth/token-x-client';
import { indexFile } from '@app/index-file';
import { getLogger } from '@app/logger';
import fastifyPlugin from 'fastify-plugin';

export const HEALTH_PLUGIN_ID = 'health';

const log = getLogger('liveness');

export const healthPlugin = fastifyPlugin(
  async (app) => {
    app.get('/isAlive', (__, reply) => reply.status(200).type('text/plain').send('Alive'));

    app.get('/isReady', async (__, reply) => {
      if (!indexFile.isReady) {
        log.info({ msg: 'Index file not ready' });

        return reply.status(503).type('text/plain').send('Index file not ready');
      }

      const isTokenXClientReady = getIsTokenXClientReady();

      if (!(oboCache.isReady || isTokenXClientReady)) {
        log.info({ msg: 'OBO Cache and TokenX Client not ready' });

        return reply.status(503).type('text/plain').send('OBO Cache and TokenX Client not ready');
      }

      if (!oboCache.isReady) {
        log.info({ msg: 'OBO Cache not ready' });

        return reply.status(503).type('text/plain').send('OBO Cache not ready');
      }

      if (!isTokenXClientReady) {
        log.info({ msg: 'TokenX Client not ready' });

        return reply.status(503).type('text/plain').send('TokenX Client not ready');
      }

      return reply.status(200).type('text/plain').send('Ready');
    });
  },
  { fastify: '5', name: HEALTH_PLUGIN_ID },
);
