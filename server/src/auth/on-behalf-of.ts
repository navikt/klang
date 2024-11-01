import { getCacheKey, oboCache } from '@app/auth/cache/cache';
import { NAIS_CLUSTER_NAME } from '@app/config/config';
import { getLogger } from '@app/logger';
import type { Client, GrantBody } from 'openid-client';

const log = getLogger('obo-token');

export const getOnBehalfOfAccessToken = async (
  authClient: Client,
  accessToken: string,
  appName: string,
  trace_id: string,
  span_id: string,
): Promise<string> => {
  const cacheKey = getCacheKey(accessToken, appName);
  const token = await oboCache.get(cacheKey);

  if (token !== null) {
    return token;
  }

  if (typeof authClient.issuer.metadata.token_endpoint !== 'string') {
    const error = new Error('OpenID issuer misconfigured. Missing token endpoint.');
    log.error({ msg: 'On-Behalf-Of error', error, trace_id, span_id });
    throw error;
  }

  try {
    const params: GrantBody = {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      subject_token: accessToken,
      audience: `${NAIS_CLUSTER_NAME}:klage:${appName}`,
    };

    const { access_token: obo_access_token, expires_at } = await authClient.grant(params, {
      clientAssertionPayload: {
        aud: authClient.issuer.metadata.token_endpoint,
        nbf: now(),
      },
    });

    if (typeof obo_access_token !== 'string') {
      throw new Error('No on-behalf-of access token from TokenX.');
    }

    if (typeof expires_at === 'number') {
      oboCache.set(cacheKey, obo_access_token, expires_at);
    }

    return obo_access_token;
  } catch (error) {
    log.error({ msg: 'On-Behalf-Of error', error, trace_id, span_id });

    throw error;
  }
};

const now = () => Math.floor(Date.now() / 1_000);
