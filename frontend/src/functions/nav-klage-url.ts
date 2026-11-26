import { ENVIRONMENT } from '@app/environment/environment';
import { Languages } from '@app/language/types';

const NAV_KLAGE_URL = ENVIRONMENT.isProduction ? 'https://www.nav.no/klage' : 'https://www.ekstern.dev.nav.no/klage';

export const getNavKlageUrl = (lang: Languages): string =>
  lang === Languages.nb ? NAV_KLAGE_URL : `${NAV_KLAGE_URL}/${lang}`;
