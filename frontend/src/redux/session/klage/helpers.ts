import { ISessionCase } from '@app/components/case/uinnlogget/types';
import { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { CASE_TYPE_PATH_SEGMENTS, CaseType } from '@app/redux-api/case/types';

export const getSessionCaseKey = (type: CaseType, ytelse: Innsendingsytelse): string =>
  `${CASE_TYPE_PATH_SEGMENTS[type]}-${ytelse}`;

export const createSessionCase = (
  type: CaseType,
  innsendingsytelse: Innsendingsytelse,
  internalSaksnummer: string | null,
): ISessionCase => ({
  id: getId(),
  type,
  innsendingsytelse,
  foedselsnummer: '',
  navn: {
    fornavn: '',
    etternavn: '',
  },
  fritekst: '',
  internalSaksnummer,
  userSaksnummer: null,
  vedtakDate: null,
  checkboxesSelected: [],
  hasVedlegg: false,
  modifiedByUser: new Date().toISOString(),
  caseIsAtKA: null,
});

const SUPPORTS_CRYPTO =
  'crypto' in window &&
  typeof window.crypto === 'object' &&
  window.crypto !== null &&
  'getRandomValues' in window.crypto &&
  typeof window.crypto.getRandomValues === 'function';

const fallbackIdGenerator = (): `${string}-${string}` => {
  const now = new Date().getTime();
  const random = Math.random().toString(36).substring(2);

  return `${now}-${random}`;
};

const getId = SUPPORTS_CRYPTO ? crypto.randomUUID : fallbackIdGenerator;
