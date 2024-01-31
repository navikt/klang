import { redirectMiddleware } from '@app/middleware/redirect/redirect';
import { Request, Response } from '@app/types/http';

describe('redirect', () => {
  it('should not redirect other methods than GET', () => {
    expect.assertions(3);

    const url = '/nb/klage/ny';
    const req: Request = createRequest(url, 'POST');
    const res: Response = { redirect: jest.fn(), cookie: jest.fn() };
    const next = jest.fn();

    redirectMiddleware(req, res, next);

    expect(res.redirect).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('should redirect requests to numeric IDs without suffix path', () => {
    expect.assertions(3);
    internalRedirect('/nb/klage/123', '/nb/klage/123/begrunnelse');
  });

  it('should not redirect requests to numeric IDs with suffix path', () => {
    expect.assertions(3);
    noRedirect('/nb/klage/123/begrunnelse');
  });

  it('should redirect requests to UUID IDs without suffix path', () => {
    expect.assertions(3);
    internalRedirect(
      '/nb/klage/acf74e14-c38f-4ad4-9759-9b63981d7ef9',
      '/nb/klage/acf74e14-c38f-4ad4-9759-9b63981d7ef9/begrunnelse',
    );
  });

  it('should not redirect requests to UUID IDs with suffix path', () => {
    expect.assertions(3);
    noRedirect('/nb/klage/acf74e14-c38f-4ad4-9759-9b63981d7ef9/begrunnelse');
  });

  it('should redirect to ytelse based on query params', () => {
    expect.assertions(3);
    internalRedirect('/nb/anke?tema=YRK&tittel=YRKESSKADE', '/nb/anke/YRKESSKADE');
  });

  it('should redirect to path without /ny and preserve saksnummer', () => {
    expect.assertions(3);
    internalRedirect('/nb/anke/ny/YRKESSKADE?saksnummer=123', '/nb/anke/YRKESSKADE?saksnummer=123');
  });

  it('should redirect to path without /ny based on path param', () => {
    expect.assertions(3);
    internalRedirect('/nb/anke/ny/YRKESSKADE', '/nb/anke/YRKESSKADE');
  });

  it('should redirect to path without /ny based on query params', () => {
    expect.assertions(3);
    internalRedirect('/nb/anke/ny?tema=YRK&tittel=YRKESSKADE', '/nb/anke/YRKESSKADE');
  });

  it('should redirect to path without /ny without type based on query params', () => {
    expect.assertions(3);
    internalRedirect('/nb/ny?tema=YRK&tittel=YRKESSKADE', '/nb/klage/YRKESSKADE');
  });

  it('should preserve saksnummer on redirect without type based on query params', () => {
    expect.assertions(3);
    internalRedirect('/nb/ny?tema=YRK&tittel=YRKESSKADE&saksnummer=123', '/nb/klage/YRKESSKADE?saksnummer=123');
  });

  it('should redirect from /nb/klage/ny to nav.no/klage', () => {
    expect.assertions(3);
    externalRedirect('/nb/klage/ny');
  });

  it('should redirect / to nav.no/klage', () => {
    expect.assertions(3);
    externalRedirect('/');
  });

  it('should not redirect /nb/klage/DAGPENGER', () => {
    expect.assertions(3);
    noRedirect('/nb/klage/DAGPENGER');
  });

  it('should not redirect /nb/ettersendelse/DAGPENGER', () => {
    expect.assertions(3);
    noRedirect('/nb/ettersendelse/DAGPENGER');
  });

  it('should redirect /nb/anke/uinnlogget/DAGPENGER/begrunnelse', () => {
    expect.assertions(3);
    internalRedirect('/nb/anke/uinnlogget/DAGPENGER/begrunnelse', '/nb/anke/DAGPENGER/begrunnelse');
  });
});

const internalRedirect = (from: string, to: string) => {
  const req: Request = createRequest(from, 'GET');
  const res: Response = { redirect: jest.fn(), cookie: jest.fn() };
  const next = jest.fn();

  redirectMiddleware(req, res, next);

  expect(res.redirect).toHaveBeenCalledWith(301, to);
  expect(res.cookie).toHaveBeenCalledWith('redirected_from', from, { httpOnly: true, sameSite: 'strict' });
  expect(next).not.toHaveBeenCalledWith();
};

const externalRedirect = (from: string) => {
  const req: Request = createRequest(from, 'GET');
  const res: Response = { redirect: jest.fn(), cookie: jest.fn() };
  const next = jest.fn();

  redirectMiddleware(req, res, next);

  expect(res.redirect).toHaveBeenCalledWith(301, 'https://www.ekstern.dev.nav.no/klage');
  expect(res.cookie).toHaveBeenCalledWith('redirected_from', '', {
    expires: new Date(0),
    httpOnly: true,
    maxAge: 0,
    sameSite: 'strict',
  });
  expect(next).not.toHaveBeenCalled();
};

const noRedirect = (url: string) => {
  const req: Request = createRequest(url, 'GET');
  const res: Response = { redirect: jest.fn(), cookie: jest.fn() };
  const next = jest.fn();

  redirectMiddleware(req, res, next);

  expect(res.redirect).not.toHaveBeenCalledWith();
  expect(res.cookie).toHaveBeenCalledWith('redirected_from', '', {
    expires: new Date(0),
    httpOnly: true,
    maxAge: 0,
    sameSite: 'strict',
  });
  expect(next).toHaveBeenCalledWith();
};

const createRequest = (url: string, method: string): Request => {
  const [pathname, search] = url.split('?');

  if (pathname === undefined) {
    throw new Error(`Could not split url ${url} into pathname and search.`);
  }

  return {
    url,
    path: pathname,
    method,
    query: search === undefined ? {} : parseQueryParams(search),
    header: () => undefined,
  };
};

const parseQueryParams = (search: string): Record<string, string | string[]> => {
  const split = search.split('&');

  const result: Record<string, string | string[]> = {};

  for (const s of split) {
    const [key, value] = s.split('=');

    if (key === undefined || value === undefined) {
      continue;
    }

    result[key] = value;
  }

  return result;
};
