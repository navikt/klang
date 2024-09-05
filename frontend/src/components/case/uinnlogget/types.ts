import type { ISODate } from '@app/domain/date/date';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType, Reason } from '@app/redux-api/case/types';
import type { IName } from '@app/redux-api/user/types';

export interface ISessionCase {
  readonly id: string;
  readonly type: CaseType;
  readonly checkboxesSelected: Reason[];
  readonly foedselsnummer: string;
  readonly navn: IName;
  readonly caseIsAtKA: boolean | null;
  readonly fritekst: string;
  readonly userSaksnummer: string | null;
  readonly internalSaksnummer: string | null;
  readonly vedtakDate: ISODate | null;
  readonly innsendingsytelse: Innsendingsytelse;
  readonly hasVedlegg: boolean;
  readonly modifiedByUser: ISODate;
}
