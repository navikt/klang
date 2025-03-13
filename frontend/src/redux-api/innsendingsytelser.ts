import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { Languages } from '@app/language/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KODEVERK_API_BASE_QUERY } from './common';

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
