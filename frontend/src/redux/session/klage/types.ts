import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { CaseType } from '@app/redux-api/case/types';

interface Base {
  type: CaseType;
  innsendingsytelse: Innsendingsytelse;
}

export interface SessionCaseLoad extends Base {
  data: { innsendingsytelse: Innsendingsytelse; internalSaksnummer: string | null };
}

export interface SessionCaseCreate extends Base {
  data: { innsendingsytelse: Innsendingsytelse; internalSaksnummer: string | null };
}

export interface SessionCasePayload extends Base {
  data: ISessionCase;
}

export interface SessionCaseUpdate extends Base {
  data: Partial<ISessionCase>;
}

export type SessionCaseRemove = Base;
