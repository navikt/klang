import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { Languages } from '@app/language/types';
import { KODEVERK_API_BASE_QUERY } from '@app/redux-api/common';
import { createApi } from '@reduxjs/toolkit/query/react';

interface InnsendingsytelseName {
  id: Innsendingsytelse;
  navn: string;
}

export const innsendingsytelserApi = createApi({
  reducerPath: 'innsendingsytelserApi',
  baseQuery: KODEVERK_API_BASE_QUERY,
  endpoints: (builder) => ({
    getInnsendingsytelser: builder.query<InnsendingsytelseName[], Languages>({
      query: (lang) => `/innsendingsytelser/${lang}`,
    }),
  }),
});

export const { useGetInnsendingsytelserQuery } = innsendingsytelserApi;
