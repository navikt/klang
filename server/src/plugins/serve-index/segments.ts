enum Language {
  NB = 'nb',
  NN = 'nn',
  EN = 'en',
}

export const LANGUAGES = Object.values(Language);

enum CaseType {
  KLAGE = 'klage',
  ANKE = 'anke',
}

export const CASE_TYPES = Object.values(CaseType);

/** Ettersendelse for klage is the default ettersendelse and lives at `/ettersendelse`. */
export const getEttersendelsePath = (type: CaseType): string =>
  type === CaseType.KLAGE ? 'ettersendelse' : `ettersendelse/${type}`;

enum Step {
  BEGRUNNELSE = 'begrunnelse',
  OPPSUMMERING = 'oppsummering',
  INNSENDING = 'innsending',
}

export const STEPS = Object.values(Step);

enum LoggedInStep {
  KVITTERING = 'kvittering',
}

export const LOGGED_IN_STEPS = Object.values(LoggedInStep);
