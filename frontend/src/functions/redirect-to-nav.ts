import { ENVIRONMENT } from '@app/environment/environment';
import { getNavKlageUrl } from '@app/functions/nav-klage-url';
import { Languages } from '@app/language/types';

export const redirectToNav = () => {
  if (ENVIRONMENT.isLocal) {
    console.info('Redirecting to Nav');

    return;
  }

  location.replace(getNavKlageUrl(Languages.nb));
};
