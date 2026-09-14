import { ENVIRONMENT } from '@app/environment/environment';

export const MAX_SIZE_UPLOAD_MIB_SINGLE = 50;
export const MAX_SIZE_UPLOAD_MIB_TOTAL = 150;

export const MAX_FILENAME_LENGTH = 196;

export const NAV_URL = ENVIRONMENT.isProduction ? 'https://www.nav.no/klage' : 'https://www.ekstern.dev.nav.no/klage';
