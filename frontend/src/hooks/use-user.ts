import { useGetUserQuery } from '@app/redux-api/user/api';
import { login } from '@app/user/login';
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
  const { data, isSuccess, isError, isLoading } = useGetUserQuery();

  if (isSuccess) {
    return { isAuthenticated: data !== undefined, isLoadingAuth: false };
  }

  if (isError) {
    return { isAuthenticated: false, isLoadingAuth: false };
  }

  if (isLoading) {
    return { isAuthenticated: undefined, isLoadingAuth: true };
  }

  return { isAuthenticated: undefined, isLoadingAuth: true };
};

/** Only for use in authorized contexts.
 * If the user is unauthorized, it will redirect to the login page.
 * It will return a loading state until the user is loaded or redirected.
 */
export const useUserRequired = (): ReturnType<typeof useGetUserQuery> => {
  const user = useGetUserQuery();
  const { data, isSuccess } = user;

  useEffect(() => {
    if (isSuccess && data === undefined) {
      login();
    }
  }, [data, isSuccess]);

  return user;
};
