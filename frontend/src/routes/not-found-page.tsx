import { redirectToNav } from '@app/functions/redirect-to-nav';
import { useEffect } from 'react';

export const NotFoundPage = () => {
  useEffect(redirectToNav, []);

  return null;
};
