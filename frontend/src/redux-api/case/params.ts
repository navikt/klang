import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { BaseCase, CaseType, CaseUpdatable } from '@app/redux-api/case/types';

export type CreateCaseParams = Pick<
  BaseCase,
  | 'innsendingsytelse'
  | 'userSaksnummer'
  | 'vedtakDate'
  | 'internalSaksnummer'
  | 'fritekst'
  | 'hasVedlegg'
  | 'type'
  | 'caseIsAtKA'
  | 'checkboxesSelected'
  | 'language'
>;

interface CaseUpdate<T extends keyof CaseUpdatable> {
  readonly id: BaseCase['id'];
  readonly key: T;
  readonly value: CaseUpdatable[T];
}

export type UpdateCaseParams = CaseUpdate<keyof CaseUpdatable>;

export interface UploadAttachmentParams {
  file: File;
  caseId: string;
}

export interface DeleteAttachmentParams {
  caseId: string;
  attachmentId: number;
}

export interface ResumeCaseParams {
  readonly type: CaseType;
  readonly innsendingsytelse: Innsendingsytelse;
  readonly internalSaksnummer: string | null;
  readonly caseIsAtKA: true | null;
}
