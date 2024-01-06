import { createSlice } from '@reduxjs/toolkit';
import { CategoryResponseTypes } from '../../types';
import { getCategories, getCategory, addNewColumn, createCategory, deleteCategory } from '../middleware/category';

const initialState: { data: CategoryResponseTypes[]; loading: boolean; error: any; category: CategoryResponseTypes } = {
  loading: false,
  data: [],
  category: null,
  error: null
};

const categorySlice = createSlice({
  name: 'categorySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // get category by id
    builder.addCase(getCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.category = action.payload;
      state.loading = false;
    });
    builder.addCase(getCategory.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // add new column
    builder.addCase(addNewColumn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addNewColumn.fulfilled, (state, action) => {
      state.category = action.payload;
      state.loading = false;
    });
    builder.addCase(addNewColumn.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // create category
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.category = action.payload;
      state.loading = false;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //delete category
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  }
});

export default categorySlice.reducer;
export const categorySelector = (state) => state.category.data;
export const categoriesSelector = (state) => state.category;
export const categoryByIdSelector = (state) => state.category.category;
export const loadingCategory = (state) => state.category.loading;
