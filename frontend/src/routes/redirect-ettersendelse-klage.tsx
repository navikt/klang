import { Navigate, useLocation, useParams } from 'react-router';

/** Redirects legacy `/:lang/ettersendelse/klage/*` paths to `/:lang/ettersendelse/*`. Invalid targets end up on the not found page. */
export const RedirectEttersendelseKlage = () => {
  const { lang, '*': rest = '' } = useParams();
  const { search, hash } = useLocation();

  return <Navigate to={`/${lang}/ettersendelse/${rest}${search}${hash}`} replace />;
};
