import type { State } from '@app/redux/session/type';
import { createSlice } from '@reduxjs/toolkit';
import { caseReducers } from './klage/reducers';

const initialState: State = {};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: caseReducers,
});

export const { setSessionCase, deleteSessionCase, updateSessionCase, loadOrCreateSessionCase } = sessionSlice.actions;
