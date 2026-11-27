import { getLogger, isSerializable } from '@app/logger';
import { RATE_LIMIT_PLUGIN_ID } from '@app/plugins/rate-limit';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('frontend-error-reporter');

export const ERROR_REPORT_PLUGIN_ID = 'error-report';

/** Requests per IP address per minute. */
const RATE_LIMIT_MAX = 120;

export const errorReportPlugin = fastifyPlugin(
  async (app) => {
    app.post(
      '/error-report',
      { config: { rateLimit: { max: RATE_LIMIT_MAX, timeWindow: '1 minute' } } },
      (req, reply) => {
        if (!isSerializable(req.body)) {
          reply.status(400).send('Invalid request body');

          return;
        }

        log.warn({ msg: 'Error report', data: req.body });

        reply.status(200).send();
      },
    );
  },
  { fastify: '5', name: ERROR_REPORT_PLUGIN_ID, dependencies: [RATE_LIMIT_PLUGIN_ID] },
);
