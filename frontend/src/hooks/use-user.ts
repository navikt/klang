import { SkipToken, skipToken } from '@reduxjs/toolkit/query';
import { useGetSessionQuery, useGetUserQuery } from '@app/redux-api/user/api';

export const useIsAuthenticated = (skip?: SkipToken) => {
  const { data, ...rest } = useGetSessionQuery(skip, { refetchOnFocus: true, refetchOnReconnect: true });

  return { ...rest, data: data?.session.active ?? false };
};

export const useUser = () => {
  const { data } = useIsAuthenticated();

  return useGetUserQuery(data === true ? undefined : skipToken);
};
