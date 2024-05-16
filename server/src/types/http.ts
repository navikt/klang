import { CookieOptions, Request as ExpressRequest, Response as ExpressResponse } from 'express';

export type Request = Pick<ExpressRequest, 'path' | 'method' | 'url' | 'query' | 'headers' | 'header'>;

export interface Response extends Pick<ExpressResponse, 'redirect' | 'locals'> {
  cookie: (name: string, value: string, options: CookieOptions) => void;
}
