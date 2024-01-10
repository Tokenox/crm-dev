import { createAsyncThunk } from '@reduxjs/toolkit';
import { destroy, get, post, put } from '../../libs/client/apiClient';
import { setAlert } from '../slice/alertSlice';

const getLeads = createAsyncThunk(
  'dynamic/get',
  async ({ categoryId, signal }: { categoryId: string; signal?: AbortSignal }, { dispatch }) => {
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

//! New Lead APIs
const getLeadsForClaim = createAsyncThunk('lead/getLeadsForClaim', async ({ signal }: { signal: AbortSignal }, { dispatch }) => {
  try {
    const { data } = await get(`/lead/claim`, { signal });
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const leadsForSuperAdmin = createAsyncThunk(
  'lead/leadForSuperAdmin',
  async (
    {
      skip,
      take,
      sort = 'desc',
      search,
      signal
    }: { skip: number; take: number; search: string; sort: 'asc' | 'desc'; signal?: AbortSignal },
    { dispatch }
  ) => {
    try {
      const { data } = await get(`/lead/all?skip=${skip}&take=${take}&search=${search}&sort=${sort}`);
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const getLeadBySource = createAsyncThunk(
  'lead/getLeadBySource',
  async (
    {
      skip,
      take,
      sort = 'desc',
      search,
      source,
      signal
    }: { skip: number; take: number; search: string; sort: 'asc' | 'desc'; source: string; signal?: AbortSignal },
    { dispatch }
  ) => {
    try {
      const { data } = await get(`/lead/${source}?skip=${skip}&take=${take}&search=${search}&sort=${sort}`, { signal });
      return data.data;
    } catch (error) {
      const { message } = error.response.data;
      dispatch(setAlert({ message, type: 'error' }));
      throw error;
    }
  }
);

const claimLead = createAsyncThunk('lead/claimLead', async ({ id }: { id: string }, { dispatch }) => {
  try {
    const { data } = await post('/lead/claim', { id });
    dispatch(setAlert({ message: 'Lead claimed successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

const deleteLead = createAsyncThunk('lead/delete', async ({ id }: { id: string }, { dispatch }) => {
  try {
    const { data } = await destroy(`/lead/${id}`);
    dispatch(setAlert({ message: 'Lead deleted successfully', type: 'success' }));
    return data.data;
  } catch (error) {
    const { message } = error.response.data;
    dispatch(setAlert({ message, type: 'error' }));
    throw error;
  }
});

export {
  getLeads,
  getLead,
  createLead,
  createBulkLead,
  updateLead,
  deleteLead,
  getLeadsForClaim,
  claimLead,
  leadsForSuperAdmin,
  getLeadBySource
};

type FieldTypes = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
};

type CreateBulkLeadsType = {
  tableName: string;
  fields: FieldTypes[];
  data: any;
};
