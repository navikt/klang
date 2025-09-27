import type { ISODate, ISODateTime } from '@app/domain/date/date';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import type { Languages } from '@app/language/types';

export enum CaseStatus {
  OPEN = 'OPEN',
  DRAFT = 'DRAFT',
  DOWNLOADED = 'DOWNLOADED',
  DONE = 'DONE',
  DELETED = 'DELETED',
}

export interface FinalizedCase {
  readonly finalizedDate: ISODate;
  readonly modifiedByUser: ISODateTime;
}

export interface DeepLinkParams {
  readonly caseIsAtKA: boolean | null;
  readonly internalSaksnummer: string | null;
  readonly sakFagsaksystem: string | null;
  readonly sakSakstype: string | null;
}

interface ReadOnlyFields {
  readonly id: string;
  readonly finalizedDate: ISODate | null;
  readonly journalpostId: string | null;
  readonly modifiedByUser: ISODateTime;
  readonly status: CaseStatus;
  readonly vedlegg: Attachment[];
}

export interface UpdateCaseFields extends DeepLinkParams {
  readonly fritekst: string;
  readonly hasVedlegg: boolean;
  readonly userSaksnummer: string | null;
  readonly vedtakDate: ISODate | null;
}

export interface CreateCaseFields extends UpdateCaseFields {
  readonly type: CaseType;
  readonly innsendingsytelse: Innsendingsytelse;
  readonly language: Languages;
}

export type BaseCase = ReadOnlyFields & CreateCaseFields;

export interface Klage extends BaseCase {
  readonly type: CaseType.KLAGE;
  readonly caseIsAtKA: never;
}

export interface Anke extends BaseCase {
  readonly type: CaseType.ANKE;
  readonly caseIsAtKA: never;
}

export interface EttersendelseKlage extends BaseCase {
  readonly type: CaseType.ETTERSENDELSE_KLAGE;
}

export interface EttersendelseAnke extends BaseCase {
  readonly type: CaseType.ETTERSENDELSE_ANKE;
  readonly caseIsAtKA: never;
}

export type Case = Klage | Anke | EttersendelseKlage | EttersendelseAnke;

export enum Reason {
  AVSLAG_PAA_SOKNAD = 'AVSLAG_PAA_SOKNAD',
  UENIG_I_VEDTAK_OM_TILBAKEBETALING = 'UENIG_I_VEDTAK_OM_TILBAKEBETALING',
  FOR_LITE_UTBETALT = 'FOR_LITE_UTBETALT',
  UENIG_I_NOE_ANNET = 'UENIG_I_NOE_ANNET',
}

export interface Attachment {
  readonly contentType: string; // Default value is "Ukjent" in backend.
  readonly id: number;
  readonly sizeInBytes: number;
  readonly tittel: string;
}

export enum CaseType {
  KLAGE = 'KLAGE',
  ANKE = 'ANKE',
  ETTERSENDELSE_KLAGE = 'KLAGE_ETTERSENDELSE',
  ETTERSENDELSE_ANKE = 'ANKE_ETTERSENDELSE',
}

export const CASE_TYPE_PATH_SEGMENTS = {
  [CaseType.KLAGE]: 'klage',
  [CaseType.ANKE]: 'anke',
  [CaseType.ETTERSENDELSE_KLAGE]: 'ettersendelse/klage',
  [CaseType.ETTERSENDELSE_ANKE]: 'ettersendelse/anke',
};

export const getEttersendelsePath = (type: CaseType) => {
  switch (type) {
    case CaseType.KLAGE:
      return CASE_TYPE_PATH_SEGMENTS[CaseType.ETTERSENDELSE_KLAGE];
    case CaseType.ANKE:
      return CASE_TYPE_PATH_SEGMENTS[CaseType.ETTERSENDELSE_ANKE];
    case CaseType.ETTERSENDELSE_KLAGE:
      return CASE_TYPE_PATH_SEGMENTS[CaseType.ETTERSENDELSE_KLAGE];
    case CaseType.ETTERSENDELSE_ANKE:
      return CASE_TYPE_PATH_SEGMENTS[CaseType.ETTERSENDELSE_ANKE];
  }
};
