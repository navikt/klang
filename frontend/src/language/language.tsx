import { en } from '@app/language/en';
import { nb, type Translations } from '@app/language/nb';
import { nn } from '@app/language/nn';
import { Languages } from '@app/language/types';

export const LANGUAGES = Object.values(Languages);

const languages: Map<Languages, Translations> = new Map([
  [Languages.nb, nb],
  [Languages.en, en],
  [Languages.nn, nn],
]);

export const getLanguage = (key?: Languages): Translations => languages.get(key ?? Languages.nb) ?? nb;

export type { Translations as Language } from '@app/language/nb';
