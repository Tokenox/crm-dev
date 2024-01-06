import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post, put, destroy } from '../../libs/client/apiClient';
import { RoleDataTypes } from '../../types';
import { setAlert } from '../slice/alertSlice';

const getRoles = createAsyncThunk('role/get', async ({ signal }: { signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get('/role', { signal });
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const createRole = createAsyncThunk('role/create', async ({ role }: { role: string }, { dispatch }) => {
  try {
    const { data } = await post('/role', { name: role });
    dispatch(setAlert({ message: 'Role created successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});
const deleteRole = createAsyncThunk('role/delete', async ({ id }: { id: string }, { dispatch }) => {
  try {
    const { data } = await destroy(`/role/${id}`);
    dispatch(setAlert({ message: data.data.message, type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

export { getRoles, createRole, deleteRole };
