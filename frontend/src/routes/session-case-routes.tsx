import { SessionCaseBegrunnelsePage } from '@app/components/case/uinnlogget/begrunnelse/begrunnelse-page';
import { SessionCaseInnsendingPage } from '@app/components/case/uinnlogget/innsending/innsending-page';
import { SessionCaseProvider } from '@app/components/case/uinnlogget/session-case-context';
import { SessionCaseOppsummeringPage } from '@app/components/case/uinnlogget/summary/oppsummering-page';
import { INNSENDINGSYTELSER } from '@app/innsendingsytelser/innsendingsytelser';
import { CASE_TYPE_PATH_SEGMENTS, CASE_TYPES } from '@app/redux-api/case/types';
import { LogoutRequired } from '@app/routes/logout-required';
import { Navigate, Route } from 'react-router';

/** Routes for cases belonging to users that are not logged in. One branch per case type, each scoped to its own case context. */
export const sessionCaseRoutes = () =>
  CASE_TYPES.map((type) => (
    <Route key={type} path={CASE_TYPE_PATH_SEGMENTS[type]}>
      {INNSENDINGSYTELSER.map((innsendingsytelse) => (
        <Route
          key={innsendingsytelse}
          path={innsendingsytelse}
          element={<LogoutRequired type={type} innsendingsytelse={innsendingsytelse} />}
        >
          <Route element={<SessionCaseProvider type={type} innsendingsytelse={innsendingsytelse} />}>
            <Route index element={<Navigate to="begrunnelse" replace />} />
            <Route path="begrunnelse" element={<SessionCaseBegrunnelsePage />} />
            <Route path="oppsummering" element={<SessionCaseOppsummeringPage />} />
            <Route path="innsending" element={<SessionCaseInnsendingPage />} />
          </Route>
        </Route>
      ))}
    </Route>
  ));
