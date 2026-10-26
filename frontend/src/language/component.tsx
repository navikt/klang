import { LANGUAGES, Languages } from '@app/language/types';
import { currentPath } from '@app/routes/current-path';
import { Provider } from '@navikt/ds-react';
import { en, nb, nn } from '@navikt/ds-react/locales';
import { onLanguageSelect, setAvailableLanguages, setParams } from '@navikt/nav-dekoratoren-moduler';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface Props {
  children: React.JSX.Element;
}

const AKSEL_LOCALES = { [Languages.nb]: nb, [Languages.nn]: nn, [Languages.en]: en };

export const LanguageComponent = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = currentPath(location);
  const currentLanguage = LANGUAGES.find(
    (l) => location.pathname === `/${l}` || location.pathname.startsWith(`/${l}/`),
  );

  useEffect(() => {
    onLanguageSelect((language) => {
      if (typeof language.url === 'string') {
        navigate(language.url);

        document.documentElement.lang = language.locale;
      }
    });

    let languageIndependentPath = path;

    if (typeof currentLanguage === 'string') {
      setParams({ language: currentLanguage });
      languageIndependentPath = path.slice(currentLanguage.length + 1);
    }

    setAvailableLanguages(
      LANGUAGES.map((l) => ({
        locale: l,
        url: `/${l}${languageIndependentPath}`,
        handleInApp: true,
      })),
    );
  }, [navigate, path, currentLanguage]);

  return <Provider locale={AKSEL_LOCALES[currentLanguage ?? Languages.nb]}>{props.children}</Provider>;
};
