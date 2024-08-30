type DecoratorLocale = 'nb' | 'nn' | 'en' | 'se' | 'pl' | 'uk' | 'ru';

export type DecoratorLanguageOption =
  | {
      url?: string;
      locale: DecoratorLocale;
      handleInApp: true;
    }
  | {
      url: string;
      locale: DecoratorLocale;
      handleInApp?: false;
    };

export type DecoratorBreadcrumb = {
  url: string;
  title: string;
  analyticsTitle?: string;
  handleInApp?: boolean;
};

export type DecoratorNaisEnv = 'prod' | 'dev' | 'beta' | 'betaTms' | 'devNext' | 'prodNext';

export type DecoratorEnvProps =
  | { env: 'localhost'; localUrl: string }
  | { env: DecoratorNaisEnv; serviceDiscovery?: boolean };

export type DecoratorFetchProps = {
  params?: DecoratorParams;
  noCache?: boolean;
} & DecoratorEnvProps;

export type DecoratorUrlProps = {
  csr?: boolean;
} & DecoratorFetchProps;

type DecoratorParams = Partial<{
  context: 'privatperson' | 'arbeidsgiver' | 'samarbeidspartner';
  simple: boolean;
  simpleHeader: boolean;
  simpleFooter: boolean;
  enforceLogin: boolean;
  redirectToApp: boolean;
  redirectToUrl: string;
  redirectToUrlLogout: string;
  level: string;
  language: DecoratorLocale;
  availableLanguages: DecoratorLanguageOption[];
  breadcrumbs: DecoratorBreadcrumb[];
  utilsBackground: 'white' | 'gray' | 'transparent';
  feedback: boolean;
  chatbot: boolean;
  chatbotVisible: boolean;
  urlLookupTable: boolean;
  shareScreen: boolean;
  logoutUrl: string;
  logoutWarning: boolean;
}>;
