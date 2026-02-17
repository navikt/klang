import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
};

export const loggedOutModalSlice = createSlice({
  name: 'loggedOutModal',
  initialState,
  reducers: {
    setShowLoggedOutModal: (state, { payload }) => {
      state.show = payload;

      return state;
    },
  },
});

export const { setShowLoggedOutModal } = loggedOutModalSlice.actions;
