import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalPatients: 0,
    totalDoctors: 0,
    appointmentsToday: 0,
    appointmentsThisMonth: 0,
    revenueThisMonth: 0,
  },
  recentAppointments: [],
  recentPatients: [],
  appointmentTrends: [],
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Set loading state
    setLoading(state, action) {
      state.isLoading = action.payload;
    },

    // Set dashboard stats
    setStats(state, action) {
      state.stats = action.payload;
    },

    // Set recent appointments
    setRecentAppointments(state, action) {
      state.recentAppointments = action.payload;
    },

    // Set recent patients
    setRecentPatients(state, action) {
      state.recentPatients = action.payload;
    },

    // Set appointment trends
    setAppointmentTrends(state, action) {
      state.appointmentTrends = action.payload;
    },

    // Set error
    setError(state, action) {
      state.error = action.payload;
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },

    // Reset dashboard
    reset(state) {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setStats,
  setRecentAppointments,
  setRecentPatients,
  setAppointmentTrends,
  setError,
  clearError,
  reset,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectRecentAppointments = (state) => state.dashboard.recentAppointments;
export const selectRecentPatients = (state) => state.dashboard.recentPatients;
export const selectAppointmentTrends = (state) => state.dashboard.appointmentTrends;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;
