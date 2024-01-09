import { createSlice } from '@reduxjs/toolkit';
import { AvailabilityResponseTypes } from '../../types';
import { createAvailability, deleteAvailability, getAvailability } from '../middleware/availability';

const initialState: { data: AvailabilityResponseTypes[]; events: { startDate: Date; endDate: Date }[]; loading: boolean; error: any } = {
  loading: false,
  data: [],
  events: [],
  error: null
};

const availabilitySlice = createSlice({
  name: 'availabilitySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Planners
    builder.addCase(getAvailability.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAvailability.fulfilled, (state, action) => {
      state.data = action.payload;
      state.events = action.payload.items.map((availability) => {
        return {
          id: availability._id,
          start: new Date(availability.startTime),
          end: new Date(availability.endTime)
        };
      });
      state.loading = false;
    });
    builder.addCase(getAvailability.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Create Availabiity
    builder.addCase(createAvailability.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAvailability.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(createAvailability.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });

    // Delete Availability
    builder.addCase(deleteAvailability.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAvailability.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteAvailability.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  }
});

export default availabilitySlice.reducer;
export const availabilitySelector = (state) => state.availability;
export const availabilityLoading = (state) => state.availability.loading;
