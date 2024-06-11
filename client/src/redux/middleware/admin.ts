import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, put } from '../../libs/client/apiClient';
import { setAlert } from '../slice/alertSlice';

const getUsers = createAsyncThunk('users/get', async ({ signal }: { signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get('/admin', { signal });
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const updateAdmin = createAsyncThunk(
  'users/update',
  async ({ id, name, role, isSuperAdmin }: { id: string; name: string; role: string; isSuperAdmin: boolean }, { dispatch }) => {
    try {
      const { data } = await put('/admin', { id, name, role, isSuperAdmin });
      dispatch(setAlert({ message: 'User updated successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

export { getUsers, updateAdmin };
