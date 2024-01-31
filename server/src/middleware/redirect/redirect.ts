import { ensureInnsendingsytelse, isInnsendingsytelse } from '@app/innsendingsytelser';
import { getInnsendingsytelseFromQueryParams, isLang, isStep, isType } from '@app/middleware/redirect/functions';
import {
  noRedirect,
  redirectToExternalKlagePage,
  redirectToFixedUrl,
  redirectToStep,
} from '@app/middleware/redirect/helpers';
import { Request, Response } from '@app/types/http';

// eslint-disable-next-line complexity
export const redirectMiddleware = (req: Request, res: Response, next: () => void) => {
  if (req.method !== 'GET') {
    return next();
  }

  // /nb/ny
  // /nb/ny?tema=DAG&tittel=DAGPENGER
  // /nb/ny/DAGPENGER
  // /nb/klage/DAGPENGER
  // /nb/klage/DAGPENGER/begrunnelse
  // /nb/klage/ny/DAGPENGER
  // /nb/klage/ny/DAGPENGER/begrunnelse
  // /nb/klage/uinnlogget/DAGPENGER
  // /nb/klage/uinnlogget/DAGPENGER/begrunnelse
  // /nb/klage/123/begrunnelse
  // /nb/klage/123
  // /nb/ettersendelse/DAGPENGER
  const [, first, second, third, fourth, fifth] = req.path.split('/'); // The first element is an empty string. Ex.: ['', 'nb', 'klage', 'DAGPENGER'].

  if (!isLang(first) || second === undefined) {
    return redirectToExternalKlagePage(req, res, { lang: 'NONE', type: 'NONE', ytelse: 'NONE', step: 'NONE' });
  }

  // /nb/klage/DAGPENGER
  // /nb/klage/DAGPENGER/begrunnelse
  if (isType(second) && isInnsendingsytelse(third)) {
    const isValidStep = fourth === undefined || isStep(fourth);

    if (!isValidStep) {
      return redirectToExternalKlagePage(req, res, { lang: first, type: second, ytelse: third, step: 'NONE' });
    }

    return noRedirect(req, res, next, {
      lang: first,
      type: second,
      ytelse: third,
      step: isStep(fourth) ? fourth : 'NONE',
      logged_in: 'false',
    });
  }

  // /nb/ny
  // /nb/ny/DAGPENGER
  // /nb/ny?tema=DAG&tittel=DAGPENGER
  if (second === 'ny') {
    const ytelse = ensureInnsendingsytelse(third) ?? getInnsendingsytelseFromQueryParams(req);

    if (ytelse !== null) {
      // Default type is klage.
      // /nb/ny/DAGPENGER -> /nb/klage/DAGPENGER
      // /nb/ny?tema=DAG&tittel=DAGPENGER -> /nb/klage/DAGPENGER
      return redirectToFixedUrl(req, res, `/${first}/klage/${ytelse}`, {
        lang: first,
        type: 'NONE',
        ytelse,
        step: 'NONE',
      });
    }

    // /nb/ny -> nav.no/klage
    // /nb/ny/NOT_AN_YTELSE -> nav.no/klage
    // /nb/ny?tema=NOT_AN_YTELSE&tittel=NOT_AN_YTELSE -> nav.no/klage
    return redirectToExternalKlagePage(req, res, { lang: first, type: 'NONE', ytelse: 'NONE', step: 'NONE' });
  }

  // /nb/not_a_type
  if (!isType(second)) {
    // Invalid second path segment.
    return redirectToExternalKlagePage(req, res, { lang: first, type: 'NONE', ytelse: 'NONE', step: 'NONE' });
  }

  // /nb/ettersendelse/DAGPENGER
  if (second === 'ettersendelse') {
    if (isInnsendingsytelse(third)) {
      return noRedirect(req, res, next, { lang: first, type: second, ytelse: third, step: 'NONE', logged_in: 'false' });
    }

    return redirectToExternalKlagePage(req, res, { lang: first, type: second, ytelse: 'NONE', step: 'NONE' });
  }

  // /nb/klage/ny/DAGPENGER
  // /nb/klage/ny/DAGPENGER/begrunnelse
  // /nb/klage/uinnlogget/DAGPENGER/begrunnelse
  if (third === 'uinnlogget' || third === 'ny') {
    const ytelse = ensureInnsendingsytelse(fourth) ?? getInnsendingsytelseFromQueryParams(req);

    if (ytelse === null) {
      return redirectToExternalKlagePage(req, res, { lang: first, type: second, ytelse: 'NONE', step: 'NONE' });
    }

    const step = isStep(fifth) ? fifth : null;
    const fixedPath = step === null ? `/${first}/${second}/${ytelse}` : `/${first}/${second}/${ytelse}/${step}`;

    return redirectToFixedUrl(req, res, fixedPath, { lang: first, type: second, ytelse, step: step ?? 'NONE' });
  }

  // /nb/klage
  // /nb/klage?tittel=DAGPENGER
  // /nb/anke
  // /nb/anke?tittel=DAGPENGER
  // /nb/ettersendelse
  if (third === undefined) {
    const ytelse = getInnsendingsytelseFromQueryParams(req);

    if (ytelse === null) {
      return redirectToExternalKlagePage(req, res, { lang: first, type: second, ytelse: 'NONE', step: 'NONE' });
    }

    // /nb/klage?tittel=DAGPENGER -> /nb/klage/DAGPENGER
    return redirectToFixedUrl(req, res, `/${first}/${second}/${ytelse}`, {
      lang: first,
      type: second,
      ytelse,
      step: 'NONE',
    });
  }

  // /nb/klage/123
  if (!isStep(fourth)) {
    return redirectToStep(req, res, `/${first}/${second}/${third}/begrunnelse`, {
      lang: first,
      type: second,
      id: third,
      step: 'NONE',
    });
  }

  // /nb/klage/123/begrunnelse
  return noRedirect(req, res, next, { lang: first, type: second, ytelse: 'NONE', step: fourth, logged_in: 'false' });
};
