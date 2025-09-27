import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import { getUniqueId } from '@app/functions/uuid';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType, DeepLinkParams } from '@app/redux-api/case/types';

export const getSessionCaseKey = (type: CaseType, ytelse: Innsendingsytelse): string =>
  `klang-${type}-${ytelse}`.toLowerCase();

interface Params {
  type: CaseType;
  innsendingsytelse: Innsendingsytelse;
  deepLinkParams: DeepLinkParams;
}

export const createSessionCase = ({ type, innsendingsytelse, deepLinkParams }: Params): ISessionCase => ({
  id: getUniqueId(),
  type,
  innsendingsytelse,
  foedselsnummer: '',
  navn: {
    fornavn: '',
    etternavn: '',
  },
  fritekst: '',
  userSaksnummer: null,
  vedtakDate: null,
  hasVedlegg: false,
  modifiedByUser: new Date().toISOString(),
  ...deepLinkParams,
});
