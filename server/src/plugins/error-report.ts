import { getLogger, isSerializable } from '@app/logger';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('frontend-error-reporter');

export const ERROR_REPORT_PLUGIN_ID = 'error-report';

export const errorReportPlugin = fastifyPlugin(
  async (app) => {
    app.post('/error-report', (req, reply) => {
      if (!isSerializable(req.body)) {
        reply.status(400).send('Invalid request body');

        return;
      }

      log.warn({ msg: 'Error report', data: req.body });

      reply.status(200).send();
    });
  },
  { fastify: '5', name: ERROR_REPORT_PLUGIN_ID },
);
