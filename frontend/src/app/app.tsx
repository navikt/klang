import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { reduxStore } from '@app/redux/configure-store';
import { Router } from '@app/routes/routes';
import '@navikt/ds-css';

export const App = () => (
  <StrictMode>
    <Provider store={reduxStore}>
      <Router />
    </Provider>
  </StrictMode>
);
