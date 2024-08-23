import type {
  DecoratorBreadcrumb,
  DecoratorLanguageOption,
  DecoratorNaisEnv,
  DecoratorUrlProps,
} from '@app/nav-dekoratoren/types';

type NaisUrls = Record<DecoratorNaisEnv, string>;

const externalUrls: NaisUrls = {
  prod: 'https://www.nav.no/dekoratoren',
  dev: 'https://dekoratoren.ekstern.dev.nav.no',
  beta: 'https://dekoratoren-beta.intern.dev.nav.no',
  betaTms: 'https://dekoratoren-beta-tms.intern.dev.nav.no',
  devNext: 'https://decorator-next.ekstern.dev.nav.no',
  prodNext: 'https://www.nav.no/decorator-next',
};

const serviceUrls: NaisUrls = {
  prod: 'http://nav-dekoratoren.personbruker',
  dev: 'http://nav-dekoratoren.personbruker',
  beta: 'http://nav-dekoratoren-beta.personbruker',
  betaTms: 'http://nav-dekoratoren-beta-tms.personbruker',
  devNext: 'http://decorator-next.personbruker',
  prodNext: 'http://decorator-next.personbruker',
};

const objectToQueryString = (
  params: Record<string, boolean | string | DecoratorLanguageOption[] | DecoratorBreadcrumb[]>,
) =>
  params
    ? Object.entries(params).reduce(
        (acc, [k, v], i) =>
          v !== undefined
            ? `${acc}${i ? '&' : '?'}${k}=${encodeURIComponent(typeof v === 'object' ? JSON.stringify(v) : v)}`
            : acc,
        '',
      )
    : '';

const getNaisUrl = (env: DecoratorNaisEnv, csr = false, serviceDiscovery = true) => {
  const shouldUseServiceDiscovery = serviceDiscovery && !csr;

  return (shouldUseServiceDiscovery ? serviceUrls[env] : externalUrls[env]) || externalUrls.prod;
};

export const getDecoratorUrl = (props: DecoratorUrlProps) => {
  const { env, params, csr } = props;
  const baseUrl = env === 'localhost' ? props.localUrl : getNaisUrl(env, csr, props.serviceDiscovery);

  if (params === undefined) {
    return baseUrl;
  }

  return `${baseUrl}/${csr === true ? 'env' : ''}${objectToQueryString(params)}`;
};
