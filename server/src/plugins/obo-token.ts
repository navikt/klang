import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { oboRequestDuration } from '@app/auth/cache/cache-gauge';
import { getOnBehalfOfAccessToken } from '@app/auth/on-behalf-of';
import { getTokenXClient } from '@app/auth/token-x-client';
import { isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('obo-token-plugin');

declare module 'fastify' {
  interface FastifyRequest {
    /** OBO token cache. */
    oboAccessTokenMap: Map<string, string>;
    /** Gets OBO token and caches it. */
    getOboAccessToken(appName: string, reply?: FastifyReply): Promise<string | undefined>;
    getCachedOboAccessToken(appName: string): string | undefined;
  }
}

const ASYNC_NOOP = async () => undefined;
const SYNC_NOOP = () => undefined;

export const OBO_ACCESS_TOKEN_PLUGIN_ID = 'obo-access-token';

export const oboAccessTokenPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest('oboAccessTokenMap');

    app.addHook('onRequest', async (req): Promise<void> => {
      req.oboAccessTokenMap = new Map();
    });

    if (isDeployed) {
      app.decorateRequest('getOboAccessToken', async function (appName: string, reply?: FastifyReply) {
        const requestOboAccessToken = this.oboAccessTokenMap.get(appName);

        if (requestOboAccessToken !== undefined) {
          return requestOboAccessToken;
        }

        const oboAccessToken = await getOboToken(appName, this, reply);

        if (oboAccessToken !== undefined) {
          this.oboAccessTokenMap.set(appName, oboAccessToken);
        } else {
          this.oboAccessTokenMap.delete(appName);
        }

        return oboAccessToken;
      });

      app.decorateRequest('getCachedOboAccessToken', function (appName: string) {
        return (
          this.oboAccessTokenMap.get(appName) ?? oboCache.getCached(getCacheKey(this.accessToken, appName)) ?? undefined
        );
      });
    } else {
      app.decorateRequest('getOboAccessToken', ASYNC_NOOP);
      app.decorateRequest('getCachedOboAccessToken', SYNC_NOOP);
    }
  },
  {
    fastify: '5',
    name: OBO_ACCESS_TOKEN_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID],
  },
);

type GetOboToken = (appName: string, req: FastifyRequest, reply?: FastifyReply) => Promise<string | undefined>;

const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { trace_id, span_id, accessToken, url, client_version } = req;

  log.debug({
    msg: `Getting OBO token for "${appName}".`,
    trace_id,
    span_id,
    client_version,
    data: { route: url },
  });

  if (accessToken.length === 0) {
    log.debug({ msg: 'No access token found.', trace_id, span_id, data: { route: url } });

    return undefined;
  }

  try {
    const tokenXClientStart = performance.now();
    const authClient = await getTokenXClient();
    reply?.addServerTiming('token_x_client_middleware', getDuration(tokenXClientStart), 'TokenX Client Middleware');

    const oboStart = performance.now();
    const oboAccessToken = await getOnBehalfOfAccessToken(authClient, accessToken, appName, trace_id, span_id);

    const duration = getDuration(oboStart);
    oboRequestDuration.observe(duration);
    reply?.addServerTiming('obo_token_middleware', duration, 'OBO Token Middleware');

    return oboAccessToken;
  } catch (error) {
    log.warn({
      msg: 'Failed to prepare request with OBO token.',
      error,
      trace_id,
      span_id,
      data: { route: req.url },
    });

    return undefined;
  }
};
