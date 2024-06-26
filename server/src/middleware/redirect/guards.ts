export const isSak = (sak: string | undefined): sak is 'sak' => sak === 'sak';

export const isAnonymousStep = (step: string | undefined): step is 'begrunnelse' | 'oppsummering' | 'innsending' => {
  if (step === undefined) {
    return false;
  }

  return step === 'begrunnelse' || step === 'oppsummering' || step === 'innsending';
};

export const isLoggedInStep = (
  step: string | undefined,
): step is 'begrunnelse' | 'oppsummering' | 'innsending' | 'kvittering' => {
  if (step === undefined) {
    return false;
  }

  return isAnonymousStep(step) || step === 'kvittering';
};

export const isLang = (lang: string | undefined): lang is 'nb' | 'nn' | 'en' => {
  if (lang === undefined) {
    return false;
  }

  return lang === 'nb' || lang === 'nn' || lang === 'en';
};
