import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { getUniqueId } from '@app/functions/uuid';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType } from '@app/redux-api/case/types';

export const getSessionCaseKey = (type: CaseType, ytelse: Innsendingsytelse): string =>
  `klang-${type}-${ytelse}`.toLowerCase();

export const createSessionCase = (
  type: CaseType,
  innsendingsytelse: Innsendingsytelse,
  internalSaksnummer: string | null,
): ISessionCase => ({
  id: getUniqueId(),
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
