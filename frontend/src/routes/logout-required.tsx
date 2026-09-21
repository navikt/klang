import { LoadingPage } from '@app/components/loading-page/loading-page';
import { useDeepLinkParams } from '@app/hooks/use-deep-link-params';
import { useIsAuthenticated } from '@app/hooks/use-user';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { useLanguage } from '@app/language/use-language';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useResumeOrCreateCaseMutation } from '@app/redux-api/case/api';
import type { CaseType } from '@app/redux-api/case/types';
import { Alert } from '@navikt/ds-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

interface Props {
  type: CaseType;
  innsendingsytelse: Innsendingsytelse;
}

/** Guards the routes for users that are not logged in.
 * Logged in users have no business keeping a case in memory, so they are sent to their case on the server instead.
 */
export const LogoutRequired = ({ type, innsendingsytelse }: Props) => {
  const { isAuthenticated, isLoadingAuth } = useIsAuthenticated();
  const { user_loader, case_loader, error_messages } = useTranslation();
  const deepLinkParams = useDeepLinkParams();
  const language = useLanguage();
  const navigate = useNavigate();

  const [resumeOrCreateCase, { isLoading, isError, isSuccess }] = useResumeOrCreateCaseMutation();

  useEffect(() => {
    if (isLoadingAuth || isAuthenticated !== true || isLoading || isError || isSuccess) {
      return;
    }

    appEvent(AppEventEnum.CASE_CREATE_OR_RESUME);

    resumeOrCreateCase({ innsendingsytelse, type, ...deepLinkParams })
      .unwrap()
      .then(({ id }) => navigate(`/${language}/sak/${id}/begrunnelse`, { replace: true }));
  }, [
    deepLinkParams,
    innsendingsytelse,
    isAuthenticated,
    isError,
    isLoading,
    isLoadingAuth,
    isSuccess,
    language,
    navigate,
    resumeOrCreateCase,
    type,
  ]);

  if (isLoadingAuth) {
    return <LoadingPage>{user_loader.loading_user}</LoadingPage>;
  }

  if (isAuthenticated) {
    return isError ? (
      <Alert variant="error">{error_messages.create_error[type]}</Alert>
    ) : (
      // Waiting for case to be created/resumed and redirect to case.
      <LoadingPage>{case_loader.loading}</LoadingPage>
    );
  }

  return <Outlet />;
};
