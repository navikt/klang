import { KLAGE_DITTNAV_API } from '@app/config/config';
import { DEV_URL, isDeployed } from '@app/config/env';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLoginUrl, redirectToLoginIfLoggedOut } from '@app/helpers/require-login';
import { getTraceContext } from '@app/helpers/trace-context';
import { type IndexFileStatus, indexFile } from '@app/index-file';
import { getClientErrorIndexFileStatus, isClientErrorStatus, UNKNOWN_CLIENT_ERROR } from '@app/index-file-status';
import { getLogger } from '@app/logger';
import { ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/access-token';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { RATE_LIMIT_PLUGIN_ID, RateLimitError } from '@app/plugins/rate-limit';
import { LANGUAGES } from '@app/plugins/serve-index/segments';
import type { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('case-file');

export const CASE_FILE_PLUGIN_ID = 'case-file';

interface CaseFilePluginOptions {
  /** Redirect logged out users to login. Requires Wonderwall, so only enabled when deployed. */
  requireLogin: boolean;
}

/** Requests per IP address per time window. Generous, as users may open several files, and some share IP address. */
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_TIME_WINDOW = '1 minute';

interface CaseParams {
  id: string;
}

interface AttachmentParams extends CaseParams {
  attachmentId: string;
}

interface CaseFileRoute<P extends CaseParams> {
  Params: P;
}

/**
 * Serves case files (attachments and case PDFs) for logged in users, for opening in a new tab.
 * Streams the file from the API without buffering it in memory, and shows a helpful error page if the file cannot be served.
 */
export const caseFilePlugin = fastifyPlugin<CaseFilePluginOptions>(
  async (app, { requireLogin }) => {
    const routeOptions: RouteShorthandOptions = {
      config: {
        rateLimit: {
          max: RATE_LIMIT_MAX,
          timeWindow: RATE_LIMIT_TIME_WINDOW,
        },
      },
      errorHandler: (error, _, reply) => {
        if (error instanceof RateLimitError) {
          return sendIndexFile(reply, 429, UNKNOWN_CLIENT_ERROR);
        }

        throw error;
      },
      preHandler: requireLogin ? redirectToLoginIfLoggedOut : [],
    };

    for (const lang of LANGUAGES) {
      app.get<CaseFileRoute<AttachmentParams>>(`/${lang}/sak/:id/vedlegg/:attachmentId`, routeOptions, (req, reply) => {
        const { id, attachmentId } = req.params;

        return sendCaseFile(
          req,
          reply,
          {
            logLabel: 'attachment',
            caseId: id,
            attachmentId,
            upstreamPath: `/api/klanker/${id}/vedlegg/${attachmentId}`,
          },
          requireLogin,
        );
      });

      app.get<CaseFileRoute<CaseParams>>(`/${lang}/sak/:id/pdf`, routeOptions, (req, reply) => {
        const { id } = req.params;

        return sendCaseFile(
          req,
          reply,
          { logLabel: 'case PDF', caseId: id, upstreamPath: `/api/klanker/${id}/pdf` },
          requireLogin,
        );
      });

      app.get<CaseFileRoute<CaseParams>>(`/${lang}/sak/:id/pdf/innsending`, routeOptions, (req, reply) => {
        const { id } = req.params;

        return sendCaseFile(
          req,
          reply,
          {
            logLabel: 'case PDF for postal submission',
            caseId: id,
            upstreamPath: `/api/klanker/${id}/pdf/innsending`,
          },
          requireLogin,
        );
      });
    }
  },
  {
    fastify: '5',
    name: CASE_FILE_PLUGIN_ID,
    dependencies: [ACCESS_TOKEN_PLUGIN_ID, OBO_ACCESS_TOKEN_PLUGIN_ID, RATE_LIMIT_PLUGIN_ID],
  },
);

const ID_REGEX = /^[\w-]+$/;

const isValidId = (value: string): boolean => ID_REGEX.test(value);

interface CaseFile {
  /** Describes the file in log messages, e.g. "attachment". */
  logLabel: string;
  /** Case ID from the path, validated before calling the API. */
  caseId: string;
  /** Attachment ID from the path, if the file is an attachment. Validated before calling the API. */
  attachmentId?: string;
  /** Path of the file in the API. */
  upstreamPath: string;
}

/**
 * @param requireLogin Redirect to login if the API responds with 401. Requires Wonderwall, so only enabled when deployed.
 */
const sendCaseFile = async (
  req: FastifyRequest,
  reply: FastifyReply,
  { logLabel, caseId, attachmentId, upstreamPath }: CaseFile,
  requireLogin: boolean,
) => {
  const traceContext = getTraceContext(req);

  if (!isValidId(caseId) || (attachmentId !== undefined && !isValidId(attachmentId))) {
    log.warn({ msg: `Invalid ID for ${logLabel}`, ...traceContext, data: { url: req.url } });

    return sendErrorPage(reply, 404);
  }

  // Abort the upstream request if the client goes away, e.g. by closing the tab.
  // Registered before any await, so a close during the token exchange is not missed.
  const controller = new AbortController();
  reply.raw.once('close', () => controller.abort());

  await req.getOboAccessToken(KLAGE_DITTNAV_API, reply);

  const upstreamUrl = `${API_BASE_URL}${upstreamPath}`;

  try {
    const res = await fetch(upstreamUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: getUpstreamHeaders(req),
      signal: controller.signal,
    });

    if (res.ok && res.body !== null) {
      // Fastify streams the web stream with backpressure, and cancels it if the client disconnects.
      return reply.status(200).headers(getFileHeaders(res.headers)).send(res.body);
    }

    // Release the upstream connection.
    await res.body?.cancel();

    const data = { url: req.url, statusCode: res.status };

    if (res.status === 410) {
      log.info({ msg: `The ${logLabel} is gone, as the case has been sent in`, ...traceContext, data });

      return sendErrorPage(reply, 410);
    }

    if (res.status === 404) {
      log.warn({ msg: `The ${logLabel} was not found`, ...traceContext, data });

      return sendErrorPage(reply, 404);
    }

    if (res.status === 401 && requireLogin) {
      if (!hasAttemptedLogin(req.url)) {
        log.info({ msg: `Unauthorized when fetching ${logLabel}. Redirecting to login.`, ...traceContext, data });

        return reply.redirect(getLoginUrl(withLoginAttempt(req.url)), 302);
      }

      // Avoid a login loop if the API still responds with 401 after login.
      log.error({ msg: `Unauthorized when fetching ${logLabel} after login`, ...traceContext, data });

      return sendErrorPage(reply, 502);
    }

    if (isClientErrorStatus(res.status)) {
      log.warn({ msg: `Client error when fetching ${logLabel}: ${res.status}`, ...traceContext, data });

      return sendIndexFile(reply, res.status, getClientErrorIndexFileStatus(res.status));
    }

    log.error({ msg: `Unexpected response when fetching ${logLabel}: ${res.status}`, ...traceContext, data });

    return sendErrorPage(reply, 502);
  } catch (error) {
    if (controller.signal.aborted) {
      log.debug({ msg: `Client closed the connection while fetching ${logLabel}`, ...traceContext });

      return reply;
    }

    log.error({ msg: `Failed to fetch ${logLabel}`, error, ...traceContext, data: { url: req.url } });

    return sendErrorPage(reply, 502);
  }
};

/** Marks the URL to return to after login, so a 401 after login does not cause a login loop. */
const LOGIN_ATTEMPT_PARAM = 'login_attempt';

const parseUrl = (url: string): URL => new URL(url, 'http://localhost');

const hasAttemptedLogin = (url: string): boolean => parseUrl(url).searchParams.has(LOGIN_ATTEMPT_PARAM);

const withLoginAttempt = (url: string): string => {
  const parsed = parseUrl(url);
  parsed.searchParams.set(LOGIN_ATTEMPT_PARAM, '1');

  return `${parsed.pathname}${parsed.search}`;
};

const API_BASE_URL = isDeployed ? `http://${KLAGE_DITTNAV_API}` : `${DEV_URL}/api/${KLAGE_DITTNAV_API}`;

type ErrorIndexFileStatus = Exclude<IndexFileStatus, 200>;

type ErrorStatus = Exclude<ErrorIndexFileStatus, typeof UNKNOWN_CLIENT_ERROR>;

const sendErrorPage = (reply: FastifyReply, statusCode: ErrorStatus) => sendIndexFile(reply, statusCode, statusCode);

/**
 * Responds with the app, like the 404 page, so the frontend renders the error page with Dekoratøren.
 * The status is set in the `data-status` attribute, as the frontend cannot read the HTTP status of the document.
 */
const sendIndexFile = (reply: FastifyReply, statusCode: number, indexFileStatus: ErrorIndexFileStatus) =>
  reply
    .status(statusCode)
    .header('content-type', 'text/html')
    .header('cache-control', 'no-store')
    .send(indexFile.getIndexFile(indexFileStatus));

const FORWARDED_REQUEST_HEADERS = [
  'authorization',
  'cookie',
  'idporten-token',
  'token-x-token',
  'user-agent',
  'x-client-version',
  'x-proxy-version',
];

/** Only forward the headers needed for auth and logging. Hop-by-hop and encoding headers are managed by `fetch`. */
const getUpstreamHeaders = (req: FastifyRequest): Record<string, string> => {
  const proxyHeaders = getProxyRequestHeaders(req, KLAGE_DITTNAV_API);

  return Object.fromEntries(Object.entries(proxyHeaders).filter(([key]) => FORWARDED_REQUEST_HEADERS.includes(key)));
};

const getFileHeaders = (upstream: Headers): Record<string, string> => {
  const headers: Record<string, string> = {
    'content-disposition': toInlineContentDisposition(upstream.get('content-disposition')),
    'x-content-type-options': 'nosniff',
    'cache-control': upstream.get('cache-control') ?? 'private, no-cache',
  };

  const contentType = upstream.get('content-type');

  if (contentType !== null) {
    headers['content-type'] = contentType;
  }

  const contentLength = upstream.get('content-length');

  // `fetch` decompresses encoded bodies, so the upstream content length only applies to unencoded bodies.
  if (contentLength !== null && upstream.get('content-encoding') === null) {
    headers['content-length'] = contentLength;
  }

  return headers;
};

/** Display the file in the browser tab instead of downloading it, while keeping the filename. */
const toInlineContentDisposition = (value: string | null): string =>
  value === null ? 'inline' : value.replace(ATTACHMENT_DISPOSITION_REGEX, 'inline');

const ATTACHMENT_DISPOSITION_REGEX = /^\s*attachment\b/i;
