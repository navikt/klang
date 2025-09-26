import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { LoadingPage } from '@app/components/loading-page/loading-page';
import { getBooleanQueryValue, getQueryValue } from '@app/functions/get-query-value';
import { useSessionCase } from '@app/hooks/use-session-klage';
import { useIsAuthenticated } from '@app/hooks/use-user';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { CASE_TYPE_PATH_SEGMENTS, type CaseType, type DeepLinkParams } from '@app/redux-api/case/types';
import { useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

interface Props {
  Component: React.ComponentType<{ data: ISessionCase }>;
  innsendingsytelse: Innsendingsytelse;
  type: CaseType;
}

export const KlageSessionLoader = ({ Component, innsendingsytelse, type }: Props) => {
  const { isAuthenticated, isLoadingAuth } = useIsAuthenticated();
  const [query] = useSearchParams();
  const internalSaksnummer = getQueryValue(query.get('saksnummer'));
  const sakSakstype = getQueryValue(query.get('sakstype'));
  const sakFagsaksystem = getQueryValue(query.get('fagsystem'));
  const caseIsAtKA = getBooleanQueryValue(query.get('ka')) ? true : null;

  const deepLinkParams: DeepLinkParams = useMemo(
    () => ({ internalSaksnummer, sakSakstype, sakFagsaksystem, caseIsAtKA }),
    [internalSaksnummer, sakSakstype, sakFagsaksystem, caseIsAtKA],
  );

  const [data, isLoading] = useSessionCase(type, innsendingsytelse, deepLinkParams);
  const { case_loader: klage_loader, user_loader } = useTranslation();
  const language = useLanguage();

  if (isLoadingAuth) {
    return <LoadingPage>{user_loader.loading_user}</LoadingPage>;
  }

  if (isLoading) {
    return <LoadingPage>{klage_loader.loading}</LoadingPage>;
  }

  if (isAuthenticated === true) {
    return <Navigate to={`/${language}/${CASE_TYPE_PATH_SEGMENTS[type]}/${innsendingsytelse.toLowerCase()}`} replace />;
  }

  return <Component data={data} />;
};
