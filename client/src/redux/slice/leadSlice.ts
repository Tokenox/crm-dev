import { createSlice } from '@reduxjs/toolkit';
import { LeadDetailResponseTypes, LeadsTypes } from '../../types';
import {
  getLeadById,
  getLeads,
  createLead,
  createBulkLead,
  updateLead,
  deleteLead,
  getLeadsForClaim,
  claimLead,
  leadsForSuperAdmin,
  getLeadBySource
} from '../middleware/lead';

const initialState: {
  data: LeadsTypes[];
  leadDetails: LeadDetailResponseTypes;
  claimData: LeadsTypes[];
  allLeads: LeadsTypes[];
  loading: boolean;
  allLeadsLoading: boolean;
  isModalOpen: boolean;
  error: any;
} = {
  loading: false,
  data: [],
  leadDetails: null,
  claimData: [],
  allLeads: [],
  error: null,
  isModalOpen: false,
  allLeadsLoading: false
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

    // Get Lead By Id
    builder.addCase(getLeadById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLeadById.fulfilled, (state, action) => {
      state.leadDetails = action.payload;
      state.loading = false;
    });
    builder.addCase(getLeadById.rejected, (state, action) => {
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
      state.allLeadsLoading = true;
    });
    builder.addCase(leadsForSuperAdmin.fulfilled, (state, action) => {
      const { items } = action.payload;
      const leads = items?.map((lead) => ({
        id: lead._id,
        ...lead
      }));
      state.allLeads = leads;
      state.allLeadsLoading = false;
    });
    builder.addCase(leadsForSuperAdmin.rejected, (state, action) => {
      state.error = action.error;
      state.allLeadsLoading = false;
    });

    // Get Leads by Source
    builder.addCase(getLeadBySource.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLeadBySource.fulfilled, (state, action) => {
      const { items } = action.payload;
      const leads = items?.map((lead) => ({
        id: lead._id,
        ...lead
      }));
      state.data = leads;
      state.loading = false;
    });
    builder.addCase(getLeadBySource.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  }
});

export const leadsList = (state) => state.lead.data;
export const leadState = (state: {
  lead: { data: LeadsTypes[]; claimData: any; allLeads; leadDetails; loading: boolean; allLeadsLoading; isModalOpen: boolean; error: any };
}) => state.lead;
export default leadSlice.reducer;
export const { openModal } = leadSlice.actions;
export const loadingLead = (state) => state.lead.loading;
