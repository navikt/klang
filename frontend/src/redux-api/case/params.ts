import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { BaseCase, CaseType, DeepLinkParams, UpdateCaseFields } from '@app/redux-api/case/types';

interface CaseUpdate<T extends keyof UpdateCaseFields> {
  readonly id: BaseCase['id'];
  readonly key: T;
  readonly value: UpdateCaseFields[T];
}

export type UpdateCaseParams = CaseUpdate<keyof UpdateCaseFields>;

export interface UploadAttachmentParams {
  file: File;
  caseId: string;
}

export interface DeleteAttachmentParams {
  caseId: string;
  attachmentId: number;
}

export interface ResumeCaseParams extends DeepLinkParams {
  readonly type: CaseType;
  readonly innsendingsytelse: Innsendingsytelse;
}
