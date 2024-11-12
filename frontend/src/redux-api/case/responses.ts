import type { ISODate, ISODateTime } from '@app/domain/date/date';
import type { BaseCase } from '@app/redux-api/case/types';

export interface FinalizeCaseResponse {
  readonly finalizedDate: ISODate;
  readonly modifiedByUser: ISODateTime;
}

export type BaseUpdateResponse = Pick<BaseCase, 'modifiedByUser'>;
