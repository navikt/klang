import { CaseBegrunnelsePage } from '@app/components/case/innlogget/begrunnelse/begrunnelse-page';
import { CaseSentModal } from '@app/components/case/innlogget/begrunnelse/case-sent-modal';
import { LoggedOutModal } from '@app/components/case/innlogget/begrunnelse/logged-out-modal';
import { CaseInnsendingPage } from '@app/components/case/innlogget/innsending/innsending-page';
import { CaseKvitteringPage } from '@app/components/case/innlogget/kvittering/kvittering-page';
import { CaseOppsummeringPage } from '@app/components/case/innlogget/summary/oppsummering-page';
import { LanguageComponent } from '@app/language/component';
import { DekoratorSetRedirect } from '@app/routes/dekorator-set-redirect';
import { ErrorBoundary } from '@app/routes/error-boundary';
import { LoginRequired } from '@app/routes/login-required';
import { NavigationLogger } from '@app/routes/navigation-logger';
import { NotFoundPage } from '@app/routes/not-found-page';
import { sessionCaseRoutes } from '@app/routes/session-case-routes';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

export const Router = () => (
  <BrowserRouter>
    <NavigationLogger>
      <DekoratorSetRedirect>
        <LanguageComponent>
          <ErrorBoundary>
            <Routes>
              <Route path="/:lang">
                {/* Cases for logged in users. State lives in the case API. */}
                <Route path="sak" element={<LoginRequired />}>
                  <Route path=":id">
                    <Route index element={<Navigate to="begrunnelse" replace />} />
                    <Route path="begrunnelse" element={<CaseBegrunnelsePage />} />
                    <Route path="oppsummering" element={<CaseOppsummeringPage />} />
                    <Route path="innsending" element={<CaseInnsendingPage />} />
                    <Route path="kvittering" element={<CaseKvitteringPage />} />
                  </Route>
                </Route>

                {sessionCaseRoutes()}
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <LoggedOutModal />
            <CaseSentModal />
          </ErrorBoundary>
        </LanguageComponent>
      </DekoratorSetRedirect>
    </NavigationLogger>
  </BrowserRouter>
);
