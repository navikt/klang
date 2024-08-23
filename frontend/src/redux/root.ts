import { combineReducers } from 'redux';
import { caseApi } from '@app/redux-api/case/api';
import { innsendingsytelserApi } from '@app/redux-api/innsendingsytelser';
import { oauthApi, userApi } from '@app/redux-api/user/api';
import { sessionSlice } from './session/session';

export const rootReducer = combineReducers({
  [innsendingsytelserApi.reducerPath]: innsendingsytelserApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [caseApi.reducerPath]: caseApi.reducer,
  [oauthApi.reducerPath]: oauthApi.reducer,
  session: sessionSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
