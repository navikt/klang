import React from 'react';
import './App.less';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/general/layout';
import { withRouter } from 'react-router-dom';
import KvitteringPage from './pages/kvittering/kvittering-page';
import KlageEllerAnkeTema from './components/klage-eller-anke/klage-eller-anke-tema';
import KlageEllerAnkeYtelse from './components/klage-eller-anke/klage-eller-anke-ytelse';
import KlageEllerAnkeInnsending from './components/klage-eller-anke/klage-eller-anke-innsending';
import NotFoundPage from './pages/not-found/not-found-page';
import FormLanding from './pages/form-landing-page/form-landing';
import ErrorBoundary from './components/error/ErrorBoundary';

const App = () => (
    <Layout>
        <ErrorBoundary>
            <Router>
                <Switch>
                    <Route path={['/', '/klage', '/oppsummering']} exact component={FormLanding} />
                    <Route path={'/kvittering'} exact>
                        <KvitteringPage />
                    </Route>

                    <Route path={'/klage-anke'} exact>
                        <KlageEllerAnkeTema />
                    </Route>
                    <Route path={'/klage-anke/:kategori'} exact>
                        <KlageEllerAnkeYtelse />
                    </Route>
                    <Route path={'/klage-anke/:kategori/:tema'} exact>
                        <KlageEllerAnkeInnsending />
                    </Route>
                    <Route>
                        <NotFoundPage />
                    </Route>
                </Switch>
            </Router>
        </ErrorBoundary>
    </Layout>
);

export default withRouter(App);
