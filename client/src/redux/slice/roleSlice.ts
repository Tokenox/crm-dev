import { createReducer, createSlice } from '@reduxjs/toolkit';
import { createRole, deleteRole, getRoles  } from '../middleware/role';
import { RoleDataTypes } from '../../types';

const initialState = {
  loading: false,
  data: [],
  error: null
};

const roleSlice = createSlice({
  name: 'roleSlice',
  initialState,
  reducers: {
    getRoles: (state, action) => {
      state.loading = true;
    },
    createRole: (state, action) => {
      state.loading = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRoles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    //create role
    builder.addCase(createRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createRole.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //delete role
    builder.addCase(deleteRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    
  }
});

export default roleSlice.reducer;
export const roleList = (state: { role: { data: RoleDataTypes[] } }) => state.role.data;
export const loadingRole = (state) => state.role.loading;
