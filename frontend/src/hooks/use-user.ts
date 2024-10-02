import { useGetSessionQuery, useGetUserQuery } from '@app/redux-api/user/api';
import type { IUser } from '@app/redux-api/user/types';
import { login } from '@app/user/login';
import { type SkipToken, skipToken } from '@reduxjs/toolkit/query';
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

export const useIsAuthenticated = (skip?: SkipToken): AuthResult => {
  const { data, isSuccess } = useGetSessionQuery(skip, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isSuccess) {
    return { isAuthenticated: data?.session.active ?? false, isLoadingAuth: false };
  }

  return { isAuthenticated: undefined, isLoadingAuth: true };
};

interface LoadedUser {
  user: IUser;
  isLoadingUser: false;
  isAuthenticated: true;
}

interface LoadingUser {
  user: undefined;
  isLoadingUser: true;
  isAuthenticated: true;
}

interface LoadedAnonymous {
  user: undefined;
  isLoadingUser: false;
  isAuthenticated: false;
}

const LOADED_ANONYMOUS: LoadedAnonymous = { user: undefined, isLoadingUser: false, isAuthenticated: false };
const LOADING_USER: LoadingUser = { user: undefined, isLoadingUser: true, isAuthenticated: true };

type UserResult = LoadedUser | LoadingUser | LoadedAnonymous;

export const useUser = (): UserResult => {
  const { isAuthenticated, isLoadingAuth } = useIsAuthenticated();
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(isAuthenticated === true ? undefined : skipToken);

  if (isAuthenticated === false) {
    return LOADED_ANONYMOUS;
  }

  if (user === undefined) {
    return isLoadingAuth || isLoadingUser ? LOADING_USER : LOADED_ANONYMOUS;
  }

  return { user, isLoadingUser: false, isAuthenticated: true };
};

/** Only for use in authorized contexts.
 * If the user is unauthorized, it will redirect to the login page.
 * It will return a loading state until the user is loaded or redirected.
 */
export const useUserRequired = (): LoadingUser | LoadedUser => {
  const { user, isLoadingUser, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated === false) {
      login();
    }
  }, [isAuthenticated]);

  if (isLoadingUser || !isAuthenticated) {
    return LOADING_USER;
  }

  return { user, isLoadingUser: false, isAuthenticated: true };
};
