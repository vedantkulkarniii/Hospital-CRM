import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';
import patientReducer from './slices/patientSlice.js';
import doctorReducer from './slices/doctorSlice.js';
import appointmentReducer from './slices/appointmentSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
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
