import { createSlice } from '@reduxjs/toolkit';
import { PlannerResponseTypes } from '../../types';
import { createPlanner, deletePlanner, getPlanners } from '../middleware/planner';

const initialState: { data: PlannerResponseTypes[]; events: { title: string; start: Date; end: Date }[]; loading: boolean; error: any } = {
  loading: false,
  data: [],
  events: [],
  error: null
};

const plannerSlice = createSlice({
  name: 'plannerSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Planners
    builder.addCase(getPlanners.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPlanners.fulfilled, (state, action) => {
      state.data = action.payload;
      state.events = action.payload.items.map((planner) => {
        return {
          id: planner._id,
          title: planner.title,
          start: new Date(planner.startDate),
          end: new Date(Number(planner.timeOfExecution)),
          desc: planner.description,
          source: planner.source,
          action: planner.action
        };
      });
    });
    builder.addCase(getPlanners.rejected, (state, action) => {
      state.error = action.error;
    });

    // Create Planner
    builder.addCase(createPlanner.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPlanner.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(createPlanner.rejected, (state, action) => {
      state.error = action.error;
    });

    // Delete Planner
    builder.addCase(deletePlanner.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePlanner.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(deletePlanner.rejected, (state, action) => {
      state.error = action.error;
    });
  }
});

export default plannerSlice.reducer;
export const plannerSelector = (state) => state.planner;
export const plannerLoading = (state) => state.planner.loading;
