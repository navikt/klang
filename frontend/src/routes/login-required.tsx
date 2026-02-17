import { LoadingPage } from '@app/components/loading-page/loading-page';
import { useIsAuthenticated } from '@app/hooks/use-user';
import { useTranslation } from '@app/language/use-translation';
import { useAppDispatch } from '@app/redux/configure-store';
import { setShowLoggedOutModal } from '@app/redux/logged-out-modal';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export const LoginRequired = () => {
  const { isAuthenticated, isLoadingAuth } = useIsAuthenticated();
  const { user_loader } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoadingAuth || isAuthenticated) {
      return;
    }

    dispatch(setShowLoggedOutModal(true));
  }, [isAuthenticated, isLoadingAuth, dispatch]);

  if (isLoadingAuth) {
    return <LoadingPage>{user_loader.loading_user}</LoadingPage>;
  }

  return <Outlet />;
};
