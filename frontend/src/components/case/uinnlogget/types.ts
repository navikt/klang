import type { ISODate } from '@app/domain/date/date';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType, DeepLinkParams } from '@app/redux-api/case/types';
import type { IName } from '@app/redux-api/user/types';

export interface ISessionCase extends DeepLinkParams {
  readonly id: string;
  readonly type: CaseType;
  readonly foedselsnummer: string;
  readonly navn: IName;
  readonly fritekst: string;
  readonly userSaksnummer: string | null;
  readonly vedtakDate: ISODate | null;
  readonly innsendingsytelse: Innsendingsytelse;
  readonly hasVedlegg: boolean;
  readonly modifiedByUser: ISODate;
}
