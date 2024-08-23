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

const oboAccessTokenMapKey = Symbol('oboAccessTokenMap');

declare module 'fastify' {
  interface FastifyRequest {
    [oboAccessTokenMapKey]: Map<string, string>;
    getOboAccessToken(appName: string, reply: FastifyReply): Promise<string | undefined>;
    getCachedOboAccessToken(appName: string): string | undefined;
  }
}

const NOOP = async () => undefined;

export const OBO_ACCESS_TOKEN_PLUGIN_ID = 'obo-access-token';

export const oboAccessTokenPlugin = fastifyPlugin(
  async (app) => {
    app.decorateRequest(oboAccessTokenMapKey, null);

    app.addHook('onRequest', async (req): Promise<void> => {
      req[oboAccessTokenMapKey] = new Map();
    });

    if (isDeployed) {
      app.decorateRequest('getOboAccessToken', async function (appName: string, reply: FastifyReply) {
        const cachedOboAccessToken = getCachedOboAccessToken(appName, this);

        if (cachedOboAccessToken !== undefined) {
          log.debug({
            msg: `Using cached OBO token for "${appName}".`,
            trace_id: this.trace_id,
            span_id: this.span_id,
            client_version: this.client_version,
            data: { route: this.url },
          });

          return cachedOboAccessToken;
        }

        const oboAccessToken = await getOboToken(appName, this, reply);

        if (oboAccessToken !== undefined) {
          log.debug({
            msg: `Adding OBO token for "${appName}". Had ${this[oboAccessTokenMapKey].size} before.`,
            trace_id: this.trace_id,
            span_id: this.span_id,
            client_version: this.client_version,
            data: { route: this.url },
          });

          this[oboAccessTokenMapKey].set(appName, oboAccessToken);
        }

        return oboAccessToken;
      });
    } else {
      app.decorateRequest('getOboAccessToken', NOOP);
    }

    app.decorateRequest('getCachedOboAccessToken', function (appName: string) {
      return getCachedOboAccessToken(appName, this);
    });
  },
  {
    fastify: '4',
    name: OBO_ACCESS_TOKEN_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID],
  },
);

const getCachedOboAccessToken = (appName: string, req: FastifyRequest) => {
  log.debug({
    msg: `Getting OBO token for "${appName}". Has ${req[oboAccessTokenMapKey].size} tokens.`,
    trace_id: req.trace_id,
    span_id: req.span_id,
    client_version: req.client_version,
    data: { route: req.url },
  });

  return req[oboAccessTokenMapKey].get(appName);
};

type GetOboToken = (appName: string, req: FastifyRequest, reply: FastifyReply) => Promise<string | undefined>;

const getOboToken: GetOboToken = async (appName, req, reply) => {
  const { trace_id, span_id, accessToken } = req;

  if (accessToken.length === 0) {
    return undefined;
  }

  try {
    const tokenXClientStart = performance.now();
    const authClient = await getTokenXClient();
    reply.addServerTiming('token_x_client_middleware', getDuration(tokenXClientStart), 'TokenX Client Middleware');

    const oboStart = performance.now();
    const oboAccessToken = await getOnBehalfOfAccessToken(authClient, accessToken, appName, trace_id, span_id);

    const duration = getDuration(oboStart);
    oboRequestDuration.observe(duration);
    reply.addServerTiming('obo_token_middleware', duration, 'OBO Token Middleware');

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
