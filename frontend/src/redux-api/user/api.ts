import { setSessionEndsAt, setTokenExpires } from '@app/logging/logger';
import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY, OAUTH_BASE_QUERY } from '../common';
import type { IUser } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: API_BASE_QUERY,
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      query: () => '/bruker',
      providesTags: ['user'],
    }),
  }),
});

interface OAuthSessionData {
  session: {
    created_at: string;
    /** DateTime when the session ends. */
    ends_at: string;
    timeout_at: string;
    /** How long the session has left in seconds. */
    ends_in_seconds: number;
    active: boolean;
    timeout_in_seconds: number;
  };
  tokens: {
    /** DateTime when the token expires. */
    expire_at: string;
    refreshed_at: string;
    expire_in_seconds: number;
    next_auto_refresh_in_seconds: number;
    refresh_cooldown: boolean;
    refresh_cooldown_seconds: number;
  };
}

export const oauthApi = createApi({
  reducerPath: 'oauthApi',
  baseQuery: OAUTH_BASE_QUERY,
  tagTypes: ['session'],
  endpoints: (builder) => ({
    getSession: builder.query<OAuthSessionData | null, void>({
      query: () => ({ url: '/session', validateStatus: ({ status, ok }) => ok || status === 401 }),
      providesTags: ['session'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        const hasData = data !== null;

        if (hasData) {
          setTokenExpires(data.tokens.expire_at);
          setSessionEndsAt(data.session.ends_at);
        }

        if (!(hasData && data.session.active)) {
          dispatch(userApi.util.updateQueryData('getUser', undefined, () => undefined));
        }
      },
    }),
  }),
});

export const { useGetSessionQuery } = oauthApi;

export const { useGetUserQuery } = userApi;
