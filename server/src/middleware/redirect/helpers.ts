import { isDeployedToProd } from '@app/config/env';
import {
  ExternalRedirectLabels,
  InternalRedirectLabels,
  externalRedirectCounter,
  internalRedirectCounter,
  viewCountCounter,
} from '@app/middleware/redirect/counters';
import {
  deleteRedirectedCookie,
  getHasSaksnummer,
  getRedirectedFrom,
  getReferrer,
  getSaksnummer,
  removeSaksnummer,
} from '@app/middleware/redirect/functions';
import { log } from '@app/middleware/redirect/logger';
import { Request, Response } from '@app/types/http';

const YTELSE_OVERVIEW_URL = isDeployedToProd ? 'https://www.nav.no/klage' : 'https://www.ekstern.dev.nav.no/klage';

interface RequestValues {
  lang: string;
  type: string;
  ytelse: string;
  step: string;
}

export const redirectToExternalKlagePage = (req: Request, res: Response, values: RequestValues) => {
  const has_saksnummer = getHasSaksnummer(req);
  const redirected_from = getRedirectedFrom(req);

  const shared: ExternalRedirectLabels = {
    ...values,
    has_saksnummer,
    referrer: getReferrer(req),
  };

  log.warn({
    msg: `Invalid URL. Redirecting to ${YTELSE_OVERVIEW_URL}`,
    data: { ...shared, url: req.url, redirected_from, reason: 'invalid', session_id: req.sessionId },
  });

  externalRedirectCounter.inc({
    ...shared,
    url: removeSaksnummer(req.url),
    redirected_from: removeSaksnummer(redirected_from),
  });

  deleteRedirectedCookie(res);
  res.redirect(301, YTELSE_OVERVIEW_URL);
};

export const redirectToFixedUrl = (req: Request, res: Response, path: string, values: RequestValues) => {
  const saksnummer = getSaksnummer(req);
  const path_with_saksnummer = saksnummer === null ? path : `${path}?saksnummer=${saksnummer}`;
  const redirected_from = getRedirectedFrom(req); // Indicates that the user has already been redirected from a deprecated URL. Meaning that this function, redirectToFixedUrl, sent the user to a deprecated URL.

  const shared: InternalRedirectLabels = {
    ...values,
    referrer: getReferrer(req),
    has_saksnummer: saksnummer !== null ? 'true' : 'false',
  };

  log.warn({
    msg: `Deprecated URL. Redirecting to ${path_with_saksnummer}`,
    data: {
      ...shared,
      url: req.url,
      redirect_to: path_with_saksnummer,
      redirected_from,
      reason: 'deprecated',
      session_id: req.sessionId,
    },
  });

  internalRedirectCounter.inc({
    ...shared,
    url: removeSaksnummer(req.url),
    redirected_to: path,
    redirected_from: removeSaksnummer(redirected_from),
  });

  res.cookie('redirected_from', req.url, { httpOnly: true, sameSite: 'strict' });
  res.redirect(301, path_with_saksnummer);
};

interface StepCommon {
  lang: string;
  type: string;
  id: string;
  step: string;
}

export const redirectToStep = (req: Request, res: Response, path: string, common: StepCommon) => {
  const saksnummer = getSaksnummer(req);
  const path_with_saksnummer = saksnummer === null ? path : `${path}?saksnummer=${saksnummer}`;
  const redirected_from = getRedirectedFrom(req);

  const shared: InternalRedirectLabels = {
    ...common,
    referrer: getReferrer(req),
    has_saksnummer: saksnummer !== null ? 'true' : 'false',
  };

  log.warn({
    msg: `Missing step in URL. Redirecting to ${path}`,
    data: {
      ...shared,
      url: req.url,
      redirect_to: path_with_saksnummer,
      redirected_from,
      reason: 'deprecated',
      session_id: req.sessionId,
    },
  });

  internalRedirectCounter.inc({
    ...shared,
    url: removeSaksnummer(req.url),
    redirected_to: path,
    redirected_from: removeSaksnummer(redirected_from),
  });

  res.cookie('redirected_from', req.url, { httpOnly: true, sameSite: 'strict' });
  res.redirect(301, path_with_saksnummer);
};

interface NoRedirectCommon {
  lang: string;
  type: string;
  ytelse: string;
  step: string;
  logged_in: 'true' | 'false';
}

export const noRedirect = (req: Request, res: Response, next: () => void, shared: NoRedirectCommon) => {
  const redirected_from = getRedirectedFrom(req);
  const referrer = getReferrer(req);

  viewCountCounter.inc({
    ...shared,
    url: removeSaksnummer(req.url),
    redirected_from: removeSaksnummer(redirected_from),
    referrer: removeSaksnummer(referrer),
  });

  log.info({
    msg: getLoadedMessage(redirected_from),
    data: { ...shared, url: req.url, redirected_from, session_id: req.sessionId, referrer },
  });

  deleteRedirectedCookie(res);

  return next();
};

const getLoadedMessage = (redirected_from: string | undefined) =>
  redirected_from === undefined ? 'Page loaded from valid URL.' : 'Page loaded from deprecated URL.';
