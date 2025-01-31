import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiError {
  status: number;
  data: ApiErrorData;
}

export interface ApiErrorData {
  status: number;
  detail: string;
  title: string;
}

export const isApiError = (error: unknown): error is ApiError => isError(error) && isApiErrorData(error.data);

export const isApiErrorData = (data: unknown): data is ApiErrorData =>
  data !== null &&
  typeof data === 'object' &&
  'status' in data &&
  Number.isInteger(data.status) &&
  'detail' in data &&
  typeof data.detail === 'string' &&
  'title' in data &&
  typeof data.title === 'string';

export const isError = (error: unknown): error is FetchBaseQueryError => {
  if (error !== null && typeof error === 'object') {
    if ('status' in error && (typeof error.status === 'string' || typeof error.status === 'number')) {
      return true;
    }
  }

  return false;
};
