export enum FormFieldsIds {
  FNR_DNR_NPID = 'foedselsnummer',
  FORNAVN = 'fornavn',
  ETTERNAVN = 'etternavn',
  VEDTAK_DATE = 'vedtakDate',
  CASE_IS_AT_KA = 'caseIsAtKA',
  SAKSNUMMER = 'userSaksnummer',
  FRITEKST = 'fritekst',
  VEDLEGG = 'vedlegg',

  CHECKBOXES_SELECTED = 'checkboxesSelected',
  HAS_VEDLEGG = 'hasVedlegg',
}

export const FORM_FIELDS_IDS = Object.values(FormFieldsIds);
