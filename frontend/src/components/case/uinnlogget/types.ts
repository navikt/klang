import type { ISODate } from '@app/domain/date/date';
import type { DeepLinkParams } from '@app/redux-api/case/types';
import type { IName } from '@app/redux-api/user/types';

/** A case belonging to a user that is not logged in. Only ever kept in memory.
 * `type` and `innsendingsytelse` are derived from the route path, see `useSessionCase`.
 */
export interface ISessionCase extends DeepLinkParams {
  readonly id: string;
  readonly foedselsnummer: string;
  readonly navn: IName;
  readonly fritekst: string;
  readonly userSaksnummer: string | null;
  readonly vedtakDate: ISODate | null;
  readonly hasVedlegg: boolean;
  readonly modifiedByUser: ISODate;
}
