import { isDeployed, NAIS_APP_NAME, NAIS_POD_NAME } from '@app/config/env';
import { getTraceContext } from '@app/helpers/trace-context';
import { getLogger } from '@app/logger';
import { RATE_LIMIT_PLUGIN_ID } from '@app/plugins/rate-limit';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Type } from 'typebox';

const log = getLogger('unleash-proxy-plugin');

/** Requests per IP address per minute. The frontend polls each feature toggle every 15 seconds per tab. */
const RATE_LIMIT_MAX = 60;

export const unleashProxyPlugin = fastifyPlugin(
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/feature-toggle/:toggle',
      {
        schema: { params: Type.Object({ toggle: Type.String() }) },
        config: { rateLimit: { max: RATE_LIMIT_MAX, timeWindow: '1 minute' } },
      },
      async (req, reply) => {
        const toggleResponse = await fetch(`${UNLEASH_PROXY_URL}/${req.params.toggle}`, {
          method: 'QUERY',
          body: JSON.stringify({ appName: NAIS_APP_NAME, podName: NAIS_POD_NAME }),
        });

        if (!toggleResponse.ok) {
          log.error({
            msg: 'Unleash proxy request failed',
            ...getTraceContext(req),
            client_version: req.client_version,
            data: {
              status: toggleResponse.status,
              statusText: await toggleResponse.text(),
              proxyVersion: toggleResponse.headers.get('App-Version'),
            },
          });

          return reply.status(500).send({ error: 'Failed to fetch feature toggle' });
        }

        const toggle = await toggleResponse.json();

        return reply.send(toggle);
      },
    );
  },
  { fastify: '5', name: 'unleash-proxy', dependencies: [RATE_LIMIT_PLUGIN_ID] },
);

export const UNLEASH_PROXY_URL = isDeployed
  ? 'http://klage-unleash-proxy/features'
  : 'https://klang.intern.dev.nav.no/feature-toggle';
