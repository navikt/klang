import { useGetSessionQuery, useGetUserQuery } from '@app/redux-api/user/api';
import type { IUser } from '@app/redux-api/user/types';
import { type SkipToken, skipToken } from '@reduxjs/toolkit/query';

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
  const { isAuthenticated, isLoading } = useGetSessionQuery(skip, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    selectFromResult: ({ data, isLoading }) => ({ isLoading, isAuthenticated: data?.session.active }),
  });

  if (isLoading || isAuthenticated === undefined) {
    return { isAuthenticated: undefined, isLoadingAuth: true };
  }

  return { isAuthenticated, isLoadingAuth: false };
};

interface LoadedUser {
  user: IUser;
  isLoadingUser: false;
}

interface LoadingUser {
  user: undefined;
  isLoadingUser: true;
}

type UserResult = LoadedUser | LoadingUser;

export const useUser = (): UserResult => {
  const { isAuthenticated } = useIsAuthenticated();

  const { data: user } = useGetUserQuery(isAuthenticated === true ? undefined : skipToken);

  if (user === undefined) {
    return { user: undefined, isLoadingUser: true };
  }

  return { user, isLoadingUser: false };
};
