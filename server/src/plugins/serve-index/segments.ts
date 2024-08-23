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
