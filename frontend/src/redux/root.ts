import { loggedOutModalSlice } from '@app/redux/logged-out-modal';
import { caseApi } from '@app/redux-api/case/api';
import { innsendingsytelserApi } from '@app/redux-api/innsendingsytelser';
import { userApi } from '@app/redux-api/user/api';
import { combineReducers } from 'redux';
import { sessionSlice } from './session/session';

export const rootReducer = combineReducers({
  [innsendingsytelserApi.reducerPath]: innsendingsytelserApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [caseApi.reducerPath]: caseApi.reducer,
  session: sessionSlice.reducer,
  loggedOutModal: loggedOutModalSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
