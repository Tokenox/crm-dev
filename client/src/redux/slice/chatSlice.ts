import { createSlice } from '@reduxjs/toolkit';
import { ChatResponseTypes } from '../../types';
import { getChats } from '../middleware/chat';

type ChatTypes = {
  data: ChatResponseTypes[];
  loading: boolean;
  error: any;
};

const initialState: ChatTypes = {
  loading: false,
  data: [],
  error: null
};

const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Chats
    builder.addCase(getChats.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.data = action.payload.items;
      state.loading = false;
    });
    builder.addCase(getChats.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  }
});

export const chatState = (state: { chat: { data: ChatResponseTypes[]; loading: boolean; error: any } }) => state.chat;
export default chatSlice.reducer;
