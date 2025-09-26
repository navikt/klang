import { LANGUAGES } from '@app/language/language';
import { currentPath } from '@app/routes/current-path';
import { onLanguageSelect, setAvailableLanguages, setParams } from '@navikt/nav-dekoratoren-moduler';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  children: React.JSX.Element;
}

export const LanguageComponent = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    onLanguageSelect((language) => {
      if (typeof language.url === 'string') {
        navigate(language.url);

        document.documentElement.lang = language.locale;
      }
    });

    const path = currentPath(location);
    const currentLanguage = LANGUAGES.find((l) => path.startsWith(`/${l}`));
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
  }, [navigate, location]);

  return props.children;
};
