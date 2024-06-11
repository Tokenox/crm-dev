import { createSlice } from '@reduxjs/toolkit';

// error slice
type ErrorState = {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success' | null;
  open: boolean;
};
const initialState: ErrorState = {
  message: '',
  type: null,
  open: false
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = true;
    },
    closeAlert: (state) => {
      state.message = '';
      state.open = false;
    }
  }
});

export const { setAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;

export const selectAlert = (state: { alert: ErrorState }) => state.alert;
