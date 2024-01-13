import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post, put, destroy } from '../../libs/client/apiClient';
import { CategoryTypes, FieldTypes } from '../../types';
import { setAlert } from '../slice/alertSlice';

const getCategories = createAsyncThunk('category/all/get', async ({ signal }: { signal?: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get('/category', { signal });
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const getCategory = createAsyncThunk('category/get', async ({ id, signal }: { id: string; signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get(`/category/${id}`);
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const createCategory = createAsyncThunk(
  'category/create',
  async (
    {
      category,
      signal
    }: {
      category: {
        name: string;
        description?: string;
        fields: FieldTypes[];
      };
      signal: AbortSignal;
    },
    { dispatch }
  ) => {
    try {
      const { data } = await post('/category', category);
      dispatch(setAlert({ message: 'Category created successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const updateCategory = createAsyncThunk(
  'category/update',
  async ({ category }: { category: CategoryTypes & { id: string } }, { dispatch }) => {
    try {
      const { data } = await put('/category', category);
      dispatch(setAlert({ message: 'Cateogry updated successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const deleteCategory = createAsyncThunk('category/delete', async ({ id }: { id: string }, { dispatch }) => {
  try {
    const { data } = await destroy(`/category/${id}`);
    dispatch(setAlert({ message: 'Category deleted successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const addNewColumn = createAsyncThunk(
  'category/addNewColumn',
  async ({ tableId, fields }: { tableId: string; fields: FieldTypes[] }, { dispatch }) => {
    try {
      const { data } = await post(`/category/new-column`, {
        tableId,
        fields
      });
      dispatch(setAlert({ message: 'New Column added successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

export { getCategories, getCategory, createCategory, updateCategory, deleteCategory, addNewColumn };
