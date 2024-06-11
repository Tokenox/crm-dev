import { createAsyncThunk } from '@reduxjs/toolkit';
import { destroy, get, post } from '../../libs/client/apiClient';
import { AvailabilityDataTypes } from '../../types';
import { setAlert } from '../slice/alertSlice';

const getAvailability = createAsyncThunk('availability/get', async ({ signal }: { signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get('/availability', { signal });
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const createAvailability = createAsyncThunk(
  'availability/post',
  async ({ availability }: { availability: AvailabilityDataTypes }, { dispatch }) => {
    try {
      const { data } = await post('/availability', availability);
      dispatch(setAlert({ message: 'Unavailability scheduled successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const deleteAvailability = createAsyncThunk('availability/delete', async ({ id }: { id: string }, { dispatch }) => {
  try {
    const { data } = await destroy(`/availability/${id}`);
    dispatch(setAlert({ message: data.data.message, type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

export { getAvailability, createAvailability, deleteAvailability };
