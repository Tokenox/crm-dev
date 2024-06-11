import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import categorySlice from './slice/categorySlice';
import leadSlice from './slice/leadSlice';
import authSlice from './slice/authSlice';
import adminSlice from './slice/adminSlice';
import alertSlice from './slice/alertSlice';
import plannerSlice from './slice/plannerSlice';
import roleSlice from './slice/roleSlice';
import availabilitySlice from './slice/availabilitySlice';
import chatSlice from './slice/chatSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  admin: adminSlice,
  lead: leadSlice,
  category: categorySlice,
  alert: alertSlice,
  planner: plannerSlice,
  role: roleSlice,
  availability: availabilitySlice,
  chat: chatSlice
});

const persistConfig = {
  key: 'root',
  storage,
  // Optionally, you can specify which reducers to persist or blacklist specific reducers
  whitelist: ['auth'],
  blacklist: ['lead', 'category', 'admin', 'error', 'alert', 'planner', 'role']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
