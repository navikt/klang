import { INNSENDINGSYTELSER, type Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { Navigate, Route, useLocation, useParams } from 'react-router';

const STEPS = ['begrunnelse', 'oppsummering', 'innsending'];

interface Props {
  innsendingsytelse: Innsendingsytelse;
  step: string;
}

const RedirectEttersendelseKlage = ({ innsendingsytelse, step }: Props) => {
  const { lang } = useParams();
  const { search, hash } = useLocation();

  return <Navigate to={`/${lang}/ettersendelse/${innsendingsytelse.toLowerCase()}/${step}${search}${hash}`} replace />;
};

/** Redirects legacy `/:lang/ettersendelse/klage/:ytelse/:step?` paths to `/:lang/ettersendelse/:ytelse/:step`. Invalid paths are not matched. */
export const redirectEttersendelseKlageRoutes = () => (
  <Route path="ettersendelse/klage">
    {INNSENDINGSYTELSER.map((innsendingsytelse) => (
      <Route key={innsendingsytelse} path={innsendingsytelse}>
        <Route
          index
          element={<RedirectEttersendelseKlage innsendingsytelse={innsendingsytelse} step="begrunnelse" />}
        />
        {STEPS.map((step) => (
          <Route
            key={step}
            path={step}
            element={<RedirectEttersendelseKlage innsendingsytelse={innsendingsytelse} step={step} />}
          />
        ))}
      </Route>
    ))}
  </Route>
);
