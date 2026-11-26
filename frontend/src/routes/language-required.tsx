import { isLanguage } from '@app/language/use-language';
import { NotFoundPage } from '@app/routes/not-found-page';
import { Outlet, useParams } from 'react-router';

/** Only renders child routes for supported languages. Route matching is case-insensitive, so the language check is too. */
export const LanguageRequired = () => {
  const { lang } = useParams();

  return isLanguage(lang?.toLowerCase()) ? <Outlet /> : <NotFoundPage />;
};
