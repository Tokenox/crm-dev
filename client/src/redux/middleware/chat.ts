import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../libs/client/apiClient';
import { setAlert } from '../slice/alertSlice';
import { SocialActionClient } from '../../types';

const getChats = createAsyncThunk(
  'chat/get',
  async ({ leadId, source, signal }: { leadId: string; source: SocialActionClient; signal?: AbortSignal }, { dispatch }) => {
    try {
      const { data } = await get(`/chat?leadId=${leadId}&source=${source}`, { signal });
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

export { getChats };
