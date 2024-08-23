import { API_CLIENT_IDS, PORT } from '@app/config/config';
import { corsOptions } from '@app/config/cors';
import { isDeployed } from '@app/config/env';
import { querystringParser } from '@app/helpers/query-parser';
import { init } from '@app/init';
import { getLogger } from '@app/logger';
import { accessTokenPlugin } from '@app/plugins/access-token';
import { apiProxyPlugin } from '@app/plugins/api-proxy';
import { clientVersionPlugin } from '@app/plugins/client-version';
import { errorReportPlugin } from '@app/plugins/error-report';
import { frontendLogPlugin } from '@app/plugins/frontend-log/frontend-log';
import { healthPlugin } from '@app/plugins/health';
import { httpLoggerPlugin } from '@app/plugins/http-logger';
import { localDevPlugin } from '@app/plugins/local-dev';
import { notFoundPlugin } from '@app/plugins/not-found';
import { oboAccessTokenPlugin } from '@app/plugins/obo-token';
import { proxyVersionPlugin } from '@app/plugins/proxy-version';
import { serveIndexPlugin } from '@app/plugins/serve-index/serve-index';
import { serverTimingPlugin } from '@app/plugins/server-timing';
import { traceparentPlugin } from '@app/plugins/traceparent/traceparent';
import { processErrors } from '@app/process-errors';
import { EmojiIcons, sendToSlack } from '@app/slack';
import cors from '@fastify/cors';
import { fastify } from 'fastify';
import metricsPlugin from 'fastify-metrics';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ msg: 'Starting...' });

  sendToSlack('Starting...', EmojiIcons.LoadingDots);
}

const bodyLimit = 300 * 1024 * 1024; // 300 MB

fastify({ trustProxy: true, querystringParser, bodyLimit })
  .register(cors, corsOptions)
  .register(healthPlugin)
  .register(metricsPlugin, {
    endpoint: '/metrics',
    routeMetrics: {
      routeBlacklist: ['/metrics', '/isAlive', '/isReady', '/swagger', '/swagger.json'],
    },
  })
  .register(proxyVersionPlugin)
  .register(traceparentPlugin)
  .register(clientVersionPlugin)
  .register(serverTimingPlugin, { enableAutoTotal: true })
  .register(frontendLogPlugin)
  .register(errorReportPlugin)
  .register(accessTokenPlugin)
  .register(oboAccessTokenPlugin)
  .register(apiProxyPlugin, { appNames: API_CLIENT_IDS, prefix: '/api' })
  .register(localDevPlugin)
  .register(serveIndexPlugin)
  .register(notFoundPlugin)
  .register(httpLoggerPlugin)

  // Start server.
  .listen({ host: '0.0.0.0', port: PORT });

log.info({ msg: `Server listening on port ${PORT}` });

// Initialize.
init();
