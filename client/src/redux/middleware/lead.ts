import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post, put } from '../../libs/client/apiClient';
import { setAlert } from '../slice/alertSlice';

const getLeads = createAsyncThunk(
  'dynamic/get',
  async ({ categoryId, signal }: { categoryId: string; signal: AbortSignal }, { dispatch }) => {
    try {
      const { data } = await get(`/dynamic/${categoryId}`, { signal });

      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const getLead = createAsyncThunk('lead/get', async ({ id }: { id: string }, { dispatch }) => {
  try {
    const { data } = await get(`/lead/${id}`);
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const createLead = createAsyncThunk('dynamic/insert', async ({ lead, signal }: { lead: any; signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await post('/dynamic/insert', lead);
    dispatch(setAlert({ message: 'Lead created successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const createBulkLead = createAsyncThunk(
  'dynamic/createBulk',
  async ({ leads, signal }: { leads: CreateBulkLeadsType; signal: AbortSignal }, { dispatch }) => {
    try {
      const { data } = await post('/dynamic/createBulk', { ...leads });
      dispatch(setAlert({ message: 'CSV created successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const updateLead = createAsyncThunk('lead/update', async ({ lead, signal }: { lead: any; signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await put('/dynamic/update', lead);
    dispatch(setAlert({ message: 'Lead updated successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const deleteLead = createAsyncThunk('lead/delete', async ({ id, tableId }: { id: string; tableId: string }, { dispatch }) => {
  try {
    const { data } = await post(`/dynamic/delete/${id}`, { tableId });
    dispatch(setAlert({ message: 'Lead deleted successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const getLeadsForClaim = createAsyncThunk('dynamic/getLeadsForClaim', async ({ signal }: { signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get(`/dynamic/claim/leads`, { signal });
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const claimLead = createAsyncThunk(
  'dynamic/claimLead',
  async ({ id, leadId, sourceId }: { id: string; leadId: string; sourceId: string }, { dispatch }) => {
    try {
      const { data } = await post('/dynamic/claim/lead', { id, leadId, sourceId });
      dispatch(setAlert({ message: 'Lead claimed successfully', type: 'success' }));
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const leadsForSuperAdmin = createAsyncThunk(
  'dynamic/leadForSuperAdmin',
  async ({ skip, take, signal }: { skip: number; take: number; signal?: AbortSignal }, { dispatch }) => {
    try {
      const { data } = await get(`/dynamic/all/leads?skip=${skip}&take=${take}`);
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

export { getLeads, getLead, createLead, createBulkLead, updateLead, deleteLead, getLeadsForClaim, claimLead, leadsForSuperAdmin };

type FieldTypes = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
};

type CreateBulkLeadsType = {
  tableName: string;
  fields: FieldTypes[];
  data: any;
};
