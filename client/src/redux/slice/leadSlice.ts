import { createSlice } from '@reduxjs/toolkit';
import { LeadsTypes } from '../../types';
import {
  getLead,
  getLeads,
  createLead,
  createBulkLead,
  updateLead,
  deleteLead,
  getLeadsForClaim,
  claimLead,
  leadsForSuperAdmin
} from '../middleware/lead';

const initialState: { data: LeadsTypes[]; claimData: any; allLeads: any; loading: boolean; isModalOpen: boolean; error: any } = {
  loading: false,
  data: [],
  claimData: [],
  allLeads: [],
  error: null,
  isModalOpen: false
};

const leadSlice = createSlice({
  name: 'leadSlice',
  initialState,
  reducers: {
    openModal: (state, payload) => {
      state.isModalOpen = payload.payload;
    }
  },
  extraReducers: (builder) => {
    // Get Leads
    builder.addCase(getLeads.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLeads.fulfilled, (state, action) => {
      state.data = action.payload.map((lead) => ({
        ...lead,
        id: lead._id
      }));
      state.loading = false;
    });
    builder.addCase(getLeads.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Get Lead
    builder.addCase(getLead.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLead.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getLead.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Create Lead
    builder.addCase(createLead.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLead.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(createLead.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Create Bulk Lead
    builder.addCase(createBulkLead.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBulkLead.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isModalOpen = false;
      state.loading = false;
    });
    builder.addCase(createBulkLead.rejected, (state, action) => {
      state.error = action.error;
      state.isModalOpen = false;
      state.loading = false;
    });

    // Update Lead
    builder.addCase(updateLead.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLead.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(updateLead.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Delete Lead
    builder.addCase(deleteLead.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLead.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteLead.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Get Leads for Claim
    builder.addCase(getLeadsForClaim.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLeadsForClaim.fulfilled, (state, action) => {
      state.claimData = action.payload;
      state.loading = false;
    });
    builder.addCase(getLeadsForClaim.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Claim Lead
    builder.addCase(claimLead.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(claimLead.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(claimLead.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Get Leads for Super Admin
    builder.addCase(leadsForSuperAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(leadsForSuperAdmin.fulfilled, (state, action) => {
      state.allLeads = action.payload;
      state.loading = false;
    });
    builder.addCase(leadsForSuperAdmin.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  }
});

export const leadsList = (state) => state.lead.data;
export const leadState = (state: {
  lead: { data: LeadsTypes[]; claimData: any; allLeads; loading: boolean; isModalOpen: boolean; error: any };
}) => state.lead;
export default leadSlice.reducer;
export const { openModal } = leadSlice.actions;
export const loadingLead = (state) => state.lead.loading;
