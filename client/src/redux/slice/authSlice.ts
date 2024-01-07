import { createSlice } from '@reduxjs/toolkit';
import { AdminResponseTypes } from '../../types';

import { login, startVerification, register, verifyCode, completeVerification, forgotPassword, logout } from '../middleware/authentication';

type AuthState = {
  loading: boolean;
  data: AdminResponseTypes;
  error: string | null;
  verificationData: any;
  verificationLoading: boolean;
  verificationError: string | null;
  isStartVerification: boolean;
  verifyCodeLoading: boolean;
  verifyCodeError: string | null;
};

const initialState: AuthState = {
  loading: false,
  data: null,
  error: null,
  verificationData: null,
  verificationLoading: false,
  verificationError: null,
  isStartVerification: false,
  verifyCodeLoading: false,
  verifyCodeError: null
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      state.loading = true;
    },
    register: (state, action) => {
      state.loading = true;
    },
    startVerification: (state, action) => {
      state.isStartVerification = action.payload;
    }
  },

  //login
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      document.cookie = `session=${action.payload.token}`;
      localStorage.setItem('authToken', action.payload.token);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // register user
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    //verification
    builder.addCase(startVerification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(startVerification.fulfilled, (state, action) => {
      state.loading = false;
      state.verificationData = action.payload;
      state.isStartVerification = true;
    });
    builder.addCase(startVerification.rejected, (state, action) => {
      state.loading = false;
      state.verificationError = action.error.message;
      state.error = action.error.message;
    });

    //verify code
    builder.addCase(verifyCode.pending, (state) => {
      state.verifyCodeLoading = true;
      state.verifyCodeError = null;
    });
    builder.addCase(verifyCode.fulfilled, (state, action) => {
      state.verifyCodeLoading = false;
      state.data = action.payload;
      state.verifyCodeError = null;
    });
    builder.addCase(verifyCode.rejected, (state, action) => {
      state.verifyCodeLoading = false;
      state.error = action.error.message;
      state.verifyCodeError = 'Invalid code';
    });

    // complete verification
    builder.addCase(completeVerification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(completeVerification.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isStartVerification = false;
    });
    builder.addCase(completeVerification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // forgot password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      localStorage.clear();
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export default authSlice.reducer;

export const authSelector = (state: { auth: AuthState }) => state.auth;

export const { login: loginAction, register: registerAction, startVerification: startVerificationAction } = authSlice.actions;
