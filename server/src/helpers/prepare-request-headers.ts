import { PROXY_VERSION } from '@app/config/config';
import { DEV_DOMAIN, isDeployed } from '@app/config/env';
import { AUTHORIZATION_HEADER, CLIENT_VERSION_HEADER, PROXY_VERSION_HEADER, TOKEN_X_TOKEN_HEADER } from '@app/headers';
import { getLogger } from '@app/logger';
import type { FastifyRequest, RawServerBase, RequestGenericInterface } from 'fastify';

const log = getLogger('prepare-proxy-request-headers');

export const getProxyRequestHeaders = (
  req: FastifyRequest<RequestGenericInterface, RawServerBase>,
  appName: string,
): Record<string, string> => {
  const { traceparent, client_version, accessToken, trace_id, span_id } = req;

  const headers: Record<string, string> = {
    ...omit(req.raw.headers, 'set-cookie'),
    host: isDeployed ? appName : DEV_DOMAIN,
    traceparent,
    [PROXY_VERSION_HEADER]: PROXY_VERSION,
  };

  if (exists(client_version)) {
    headers[CLIENT_VERSION_HEADER] = client_version;
  }

  if (exists(accessToken)) {
    headers[TOKEN_X_TOKEN_HEADER] = accessToken;
  }

  const oboAccessToken = req.getCachedOboAccessToken(appName);

  if (oboAccessToken !== undefined) {
    headers[AUTHORIZATION_HEADER] = `Bearer ${oboAccessToken}`;
    headers['idporten-token'] = req.accessToken;
  }

  log.debug({
    msg: 'Prepared proxy request headers',
    trace_id,
    span_id,
    data: { contentType: headers['content-type'], contentLength: headers['content-length'] },
  });

  return headers;
};

const exists = (value: string): boolean => value.length !== 0;

const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
  const { [key]: _, ...rest } = obj;

  return rest;
};
