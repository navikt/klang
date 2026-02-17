import { useAppDispatch } from '@app/redux/configure-store';
import { setShowLoggedOutModal } from '@app/redux/logged-out-modal';
import { useIsAuthenticatedQuery } from '@app/redux-api/auth/api';
import { useGetUserQuery } from '@app/redux-api/user/api';
import { useEffect } from 'react';

interface LoadingAuth {
  isAuthenticated: undefined;
  isLoadingAuth: true;
}

interface LoadedAuth {
  isAuthenticated: boolean;
  isLoadingAuth: false;
}

type AuthResult = LoadingAuth | LoadedAuth;

export const useIsAuthenticated = (): AuthResult => {
  const { data, isSuccess, isError } = useIsAuthenticatedQuery();

  if (isSuccess) {
    return { isAuthenticated: data?.session.active ?? false, isLoadingAuth: false };
  }

  if (isError) {
    return { isAuthenticated: false, isLoadingAuth: false };
  }

  return { isAuthenticated: undefined, isLoadingAuth: true };
};

/** Only for use in authorized contexts.
 * If the user is unauthorized, it will show the logged out modal.
 */
export const useUserRequired = (): ReturnType<typeof useGetUserQuery> => {
  const user = useGetUserQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.isError) {
      dispatch(setShowLoggedOutModal(true));
    }
  }, [user.isError, dispatch]);

  return user;
};
