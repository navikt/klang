import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface State {
  id: string | null;
}

const initialState: State = {
  id: null,
};

export const caseSentSlice = createSlice({
  name: 'caseSent',
  initialState,
  reducers: {
    setCaseSentId: (state, { payload }: PayloadAction<string | null>) => {
      state.id = payload;

      return state;
    },
  },
});

export const { setCaseSentId } = caseSentSlice.actions;
