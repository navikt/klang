import { type ApiErrorData, isApiErrorData } from '@app/functions/is-api-error';
import { API_BASE_QUERY } from '@app/redux-api/common';
import type { IUser } from '@app/redux-api/user/types';
import { createApi } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: API_BASE_QUERY,
  endpoints: (builder) => ({
    getUser: builder.query<IUser | undefined, void>({
      query: () => ({ url: '/bruker' }),
      transformResponse: (response: IUser | ApiErrorData) => (isApiErrorData(response) ? undefined : response),
    }),
  }),
});

export const { useGetUserQuery } = userApi;
