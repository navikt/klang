import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { ISessionCase } from '@app/components/case/uinnlogget/types';
import { sessionEvent } from '@app/logging/logger';
import { SessionAction } from '@app/logging/types';
import { State } from '@app/redux/session/type';
import { createSessionCase, getSessionCaseKey } from './helpers';
import { readSessionCase, removeSessionCase, saveSessionCase } from './storage';
import { SessionCaseCreate, SessionCaseLoad, SessionCasePayload, SessionCaseRemove, SessionCaseUpdate } from './types';

const RATE_LIMIT = 30_000;
let lastUpdated = 0;

const setSessionCase: CaseReducer<State, PayloadAction<SessionCasePayload>> = (state, { payload }) => {
  lastUpdated = 0;
  sessionEvent(SessionAction.SET);

  const { type, innsendingsytelse, data } = payload;

  saveSessionCase(innsendingsytelse, data);

  return setState(state, getSessionCaseKey(type, innsendingsytelse), data);
};

const updateSessionCase: CaseReducer<State, PayloadAction<SessionCaseUpdate>> = (state, { payload }) => {
  // Rate limit updates.
  if (Date.now() - lastUpdated > RATE_LIMIT) {
    sessionEvent(SessionAction.UPDATE);
    lastUpdated = Date.now();
  }

  const { type, innsendingsytelse, data } = payload;

  const caseKey = getSessionCaseKey(type, innsendingsytelse);
  const existing = getState(state, caseKey);

  if (existing === undefined) {
    throw new Error(`Case with ID ${caseKey} does not exist`);
  }

  const updated = updateSessionCaseData(existing, data);

  const key = saveSessionCase(innsendingsytelse, updated);

  return setState(state, key, updated);
};

const loadSessionCase: CaseReducer<State, PayloadAction<SessionCaseLoad>> = (state, { payload }) => {
  lastUpdated = 0;
  sessionEvent(SessionAction.LOAD);

  const { innsendingsytelse, type } = payload;

  const sessionKey = getSessionCaseKey(type, innsendingsytelse);
  const savedCase = readSessionCase(sessionKey);

  if (savedCase === undefined) {
    return state;
  }

  return setState(state, sessionKey, savedCase);
};

// Read from session storage if it exists, otherwise save to session storage.
const loadOrCreateSessionCase: CaseReducer<State, PayloadAction<SessionCaseCreate>> = (state, { payload }) => {
  lastUpdated = 0;

  const { innsendingsytelse, data, type } = payload;

  const sessionKey = getSessionCaseKey(type, innsendingsytelse);
  const savedCase = readSessionCase(sessionKey);

  if (savedCase === undefined) {
    const newCase = createSessionCase(type, data.innsendingsytelse, data.internalSaksnummer);

    const key = saveSessionCase(innsendingsytelse, newCase);

    sessionEvent(SessionAction.CREATE);

    return setState(state, key, newCase);
  }

  if (state[sessionKey]?.id !== savedCase.id) {
    sessionEvent(SessionAction.LOAD);
  }

  return setState(state, sessionKey, savedCase);
};

const setState = (state: State, key: string, data: ISessionCase) => {
  state[key] = data;

  return state;
};

const getState = (state: State, key: string) => state[key];

const updateSessionCaseData = <T extends ISessionCase>(data: T, update: Partial<T>): ISessionCase => ({
  ...data,
  ...update,
  modifiedByUser: new Date().toISOString(),
});

const deleteSessionCase: CaseReducer<State, PayloadAction<SessionCaseRemove>> = (state, { payload }) => {
  sessionEvent(SessionAction.DELETE);

  const key = removeSessionCase(getSessionCaseKey(payload.type, payload.innsendingsytelse));

  delete state[key];

  return state;
};

export const caseReducers = {
  setSessionCase,
  updateSessionCase,
  loadSessionCase,
  deleteSessionCase,
  loadOrCreateSessionCase,
};
