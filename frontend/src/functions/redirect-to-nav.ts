import { NAV_URL } from '@app/constants';
import { ENVIRONMENT } from '@app/environment/environment';

export const redirectToNav = () => {
  if (ENVIRONMENT.isLocal) {
    console.info('Redirecting to Nav');

    return;
  }

  location.replace(NAV_URL);
};
