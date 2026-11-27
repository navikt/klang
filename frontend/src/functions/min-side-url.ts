import { ENVIRONMENT } from '@app/environment/environment';
import type { Languages } from '@app/language/types';

const MIN_SIDE_URL = ENVIRONMENT.isProduction ? 'https://www.nav.no/minside' : 'https://www.intern.dev.nav.no/minside';

export const getMinSideUrl = (lang: Languages): string => `${MIN_SIDE_URL}/${lang}`;
