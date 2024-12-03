import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
};

export const loggedOutModalSlice = createSlice({
  name: 'loggedOutModal',
  initialState,
  reducers: {
    setShow: (state, { payload }) => {
      state.show = payload;

      return state;
    },
  },
});

export const { setShow } = loggedOutModalSlice.actions;
