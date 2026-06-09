import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in auth state (e.g., Date objects)
        ignoredActions: ['auth/setCredentials'],
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
