import React from 'react';
import './App.less';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/general/layout';
import { withRouter } from 'react-router-dom';
import FormLandingPage from './pages/form-landing-page/form-landing-page';
import KvitteringPage from './pages/kvittering/kvittering-page';
import KlageEllerAnkeTema from './components/klage-eller-anke/klage-eller-anke-tema';
import KlageEllerAnkeYtelse from './components/klage-eller-anke/klage-eller-anke-ytelse';
import KlageEllerAnkeInnsending from './components/klage-eller-anke/klage-eller-anke-innsending';
import NotFoundPage from './pages/not-found/not-found-page';

const App = () => (
    <Router>
        <Layout>
            <Switch>
                <Route path={['/', '/klage']} component={FormLandingPage} exact />
                <Route path={'/oppsummering'} component={FormLandingPage} exact />
                <Route path={'/kvittering'} component={KvitteringPage} exact />

                <Route path={'/klage-anke'} component={KlageEllerAnkeTema} exact />
                <Route path={['/klage-anke/:kategori', '/:kategori']} component={KlageEllerAnkeYtelse} exact />
                <Route
                    path={['/klage-anke/:kategori/:tema', '/:kategori/:tema']}
                    component={KlageEllerAnkeInnsending}
                    exact
                />

                <Route component={NotFoundPage} />
            </Switch>
        </Layout>
    </Router>
);

export default withRouter(App);
