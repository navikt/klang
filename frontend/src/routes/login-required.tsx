import { LoadingPage } from '@app/components/loading-page/loading-page';
import { useIsAuthenticated } from '@app/hooks/use-user';
import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { login } from '@app/user/login';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export const LoginRequired = () => {
  const { isAuthenticated, isLoadingAuth } = useIsAuthenticated();
  const { user_loader } = useTranslation();

  useEffect(() => {
    if (isLoadingAuth || isAuthenticated) {
      return;
    }

    appEvent(AppEventEnum.MISSING_AUTH);
    login();
  }, [isAuthenticated, isLoadingAuth]);

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <LoadingPage>{user_loader.loading_user}</LoadingPage>;
};
