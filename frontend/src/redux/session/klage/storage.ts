import type { ISessionCase } from '@app/components/case/uinnlogget/types';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { navSessionStorage } from '@navikt/nav-dekoratoren-moduler';
import { getSessionCaseKey } from './helpers';

export const readSessionCase = (key: string): ISessionCase | undefined => {
  const json = navSessionStorage.getItem(key);

  try {
    return json === null ? undefined : JSON.parse(json);
  } catch (e) {
    console.error('Failed to parse session case', e);

    removeSessionCase(key);

    return undefined;
  }
};

export const saveSessionCase = (ytelse: Innsendingsytelse, data: ISessionCase): string => {
  if (ytelse !== data.innsendingsytelse) {
    throw new Error('Innsendingsytelse must match');
  }

  const keyString = getSessionCaseKey(data.type, ytelse);

  try {
    navSessionStorage.setItem(keyString, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save session case', e);
  }

  return keyString;
};

export const removeSessionCase = (key: string): string => {
  navSessionStorage.removeItem(key);

  return key;
};
