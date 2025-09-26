import { getLanguage, type Language } from '@app/language/language';
import { useLanguage } from '@app/language/use-language';

export const useTranslation = (): Language => {
  const lang = useLanguage();

  return getLanguage(lang);
};
