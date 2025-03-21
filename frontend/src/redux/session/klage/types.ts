import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType, DeepLinkParams } from '@app/redux-api/case/types';

interface Base {
  type: CaseType;
  innsendingsytelse: Innsendingsytelse;
}

export interface SessionCaseLoad extends Base {
  deepLinkParams: DeepLinkParams;
}

export interface SessionCaseCreate extends Base {
  deepLinkParams: DeepLinkParams;
}

export interface SessionCasePayload extends Base {
  data: ISessionCase;
}

export interface SessionCaseUpdate extends Base {
  data: Partial<ISessionCase>;
}

export type SessionCaseRemove = Base;
