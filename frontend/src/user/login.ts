import { currentPath } from '@app/routes/current-path';

export const getLoginPath = (redirectAfter: string): string =>
  `/oauth2/login?redirect=${encodeURIComponent(redirectAfter)}`;

export const getLoginRedirectPath = (): string => getLoginPath(currentPath(window.location));

export const login = () => window.location.assign(getLoginRedirectPath());
