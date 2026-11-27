import { CaseBegrunnelsePage } from '@app/components/case/innlogget/begrunnelse/begrunnelse-page';
import { CaseSentModal } from '@app/components/case/innlogget/begrunnelse/case-sent-modal';
import { LoggedOutModal } from '@app/components/case/innlogget/begrunnelse/logged-out-modal';
import { CaseInnsendingPage } from '@app/components/case/innlogget/innsending/innsending-page';
import { CaseKvitteringPage } from '@app/components/case/innlogget/kvittering/kvittering-page';
import { CaseOppsummeringPage } from '@app/components/case/innlogget/summary/oppsummering-page';
import { LanguageComponent } from '@app/language/component';
import { CaseFileErrorPage, CaseFileType } from '@app/routes/case-file-error-page';
import { DekoratorSetRedirect } from '@app/routes/dekorator-set-redirect';
import { ErrorBoundary } from '@app/routes/error-boundary';
import { LanguageRequired } from '@app/routes/language-required';
import { LoginRequired } from '@app/routes/login-required';
import { NavigationLogger } from '@app/routes/navigation-logger';
import { NotFoundPage } from '@app/routes/not-found-page';
import { RedirectEttersendelseKlage } from '@app/routes/redirect-ettersendelse-klage';
import { sessionCaseRoutes } from '@app/routes/session-case-routes';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

export const Router = () => (
  <BrowserRouter>
    <NavigationLogger>
      <DekoratorSetRedirect>
        <LanguageComponent>
          <ErrorBoundary>
            <Routes>
              <Route path="/:lang" element={<LanguageRequired />}>
                <Route index element={<NotFoundPage />} />

                {/* Cases for logged in users. State lives in the case API. */}
                <Route path="sak">
                  <Route index element={<NotFoundPage />} />
                  <Route element={<LoginRequired />}>
                    <Route path=":id">
                      <Route index element={<Navigate to="begrunnelse" replace />} />
                      <Route path="begrunnelse" element={<CaseBegrunnelsePage />} />
                      <Route path="oppsummering" element={<CaseOppsummeringPage />} />
                      <Route path="innsending" element={<CaseInnsendingPage />} />
                      <Route path="kvittering" element={<CaseKvitteringPage />} />
                      {/* Only rendered when the server cannot serve the file. */}
                      <Route
                        path="vedlegg/:attachmentId"
                        element={<CaseFileErrorPage fileType={CaseFileType.ATTACHMENT} />}
                      />
                      <Route path="pdf" element={<CaseFileErrorPage fileType={CaseFileType.PDF} />} />
                      <Route path="pdf/innsending" element={<CaseFileErrorPage fileType={CaseFileType.PDF} />} />
                    </Route>
                  </Route>
                </Route>

                <Route path="ettersendelse/klage/*" element={<RedirectEttersendelseKlage />} />

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
