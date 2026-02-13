import { loggedOutModalSlice } from '@app/redux/logged-out-modal';
import { sessionSlice } from '@app/redux/session/session';
import { authApi } from '@app/redux-api/auth/api';
import { caseApi } from '@app/redux-api/case/api';
import { innsendingsytelserApi } from '@app/redux-api/innsendingsytelser';
import { userApi } from '@app/redux-api/user/api';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  [innsendingsytelserApi.reducerPath]: innsendingsytelserApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [caseApi.reducerPath]: caseApi.reducer,
  session: sessionSlice.reducer,
  loggedOutModal: loggedOutModalSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
