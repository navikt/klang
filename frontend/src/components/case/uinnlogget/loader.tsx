import { SESSION_CASE_STORAGE_KEY_PREFIX } from '@app/components/date-picker/constants';
import { getQueryValue } from '@app/functions/get-query-value';
import { useSessionCase } from '@app/hooks/use-session-klage';
import { useIsAuthenticated } from '@app/hooks/use-user';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { CASE_TYPE_PATH_SEGMENTS, type CaseType } from '@app/redux-api/case/types';
import { createSessionCase } from '@app/redux/session/klage/helpers';
import { isStorageKeyAllowed } from '@navikt/nav-dekoratoren-moduler';
import { Navigate, useSearchParams } from 'react-router-dom';
import { LoadingPage } from '../../loading-page/loading-page';
import type { ISessionCase } from './types';

interface Props {
  Component: React.ComponentType<{ data: ISessionCase }>;
  innsendingsytelse: Innsendingsytelse;
  type: CaseType;
}

export const SessionCaseLoader = ({ Component, innsendingsytelse, type }: Props) => {
  const [query] = useSearchParams();
  const internalSaksnummer = getQueryValue(query.get('saksnummer'));
  const { isAuthenticated, isLoadingAuth } = useIsAuthenticated();
  const { user_loader } = useTranslation();
  const language = useLanguage();
  const sessionStorageAllowed = isStorageKeyAllowed(SESSION_CASE_STORAGE_KEY_PREFIX);

  if (isLoadingAuth) {
    return <LoadingPage>{user_loader.loading_user}</LoadingPage>;
  }

  if (isAuthenticated === true) {
    return <Navigate to={`/${language}/${CASE_TYPE_PATH_SEGMENTS[type]}/${innsendingsytelse.toLowerCase()}`} replace />;
  }

  if (sessionStorageAllowed) {
    return (
      <SessionStorageLoader
        Component={Component}
        type={type}
        innsendingsytelse={innsendingsytelse}
        internalSaksnummer={internalSaksnummer}
      />
    );
  }

  return <Component data={createSessionCase(type, innsendingsytelse, internalSaksnummer)} />;
};

interface PropsWithInternalSaksnummer extends Props {
  internalSaksnummer: string | null;
}

const SessionStorageLoader = ({
  Component,
  innsendingsytelse,
  type,
  internalSaksnummer,
}: PropsWithInternalSaksnummer) => {
  const [data, isLoading] = useSessionCase(type, innsendingsytelse, internalSaksnummer);
  const { case_loader } = useTranslation();

  if (isLoading) {
    return <LoadingPage>{case_loader.loading}</LoadingPage>;
  }

  return <Component data={data} />;
};
