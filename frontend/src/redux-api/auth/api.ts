import { AUTH_BASE_QUERY } from '@app/redux-api/common';
import { createApi } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: AUTH_BASE_QUERY,
  tagTypes: ['isAuthenticated'],
  endpoints: (builder) => ({
    isAuthenticated: builder.query<Session | undefined, void>({
      query: () => ({
        url: '/oauth2/session',
        validateStatus: (response) => response.status === 200 || response.status === 401,
      }),
      providesTags: ['isAuthenticated'],
    }),
  }),
});

export const { useIsAuthenticatedQuery } = authApi;

type Session = {
  session: {
    created_at: string;
    ends_at: string;
    timeout_at: string;
    ends_in_seconds: number;
    active: boolean;
    timeout_in_seconds: number;
  };
  tokens: {
    expire_at: string;
    refreshed_at: string;
    expire_in_seconds: number;
    next_auto_refresh_in_seconds: number;
    refresh_cooldown: boolean;
    refresh_cooldown_seconds: number;
  };
};
