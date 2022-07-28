import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const IS_LOCALHOST = window.location.hostname === 'localhost';

const mode: RequestMode | undefined = IS_LOCALHOST ? 'cors' : undefined;

export const staggeredBaseQuery = (baseUrl: string) => {
  const fetch = fetchBaseQuery({
    baseUrl,
    mode,
    credentials: 'include',
  });

  return retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetch(args, api, extraOptions);

      if (typeof result.error === 'undefined') {
        return result;
      }

      if (result.error.status === 401) {
        // TODO: Handle 401 error. Should contain reason in body. Show relevant UI based on reason.
        console.info('401 data', result.error);
        retry.fail(result.error.data);
      } else if (
        result.error.status === 400 ||
        result.error.status === 403 ||
        result.error.status === 404 ||
        result.error.status === 405 ||
        result.error.status === 413
      ) {
        retry.fail(result.error);
      }

      return result;
    },
    { maxRetries: 3 }
  );
};

export const API_PATH = '/api/klage-dittnav-api/api';
export const API_BASE_QUERY = staggeredBaseQuery(API_PATH);