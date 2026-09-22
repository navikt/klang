import { reduxStore } from '@app/redux/configure-store';
import { Router } from '@app/routes/routes';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';

export const App = () => (
  <StrictMode>
    <Provider store={reduxStore}>
      <Router />
    </Provider>
  </StrictMode>
);

const KLANG_PREFIX = 'klang-';

const cleanSessionStorage = () => {
  const keys = Object.keys(sessionStorage).filter((key) => key.startsWith(KLANG_PREFIX));

  for (const key of keys) {
    sessionStorage.removeItem(key);
  }
};

cleanSessionStorage();
