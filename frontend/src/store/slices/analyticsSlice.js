import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: null,
  patientDemographics: null,
  doctorPerformance: null,
  appointmentAnalytics: null,
  billingRevenue: null,
  prescriptionTrends: null,
  financialSummary: null,
  occupancyRate: null,
  loading: false,
  error: null,
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Fetch dashboard analytics
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.dashboard = action.payload;
      state.patientDemographics = action.payload.patientDemographics;
      state.doctorPerformance = action.payload.doctorPerformance;
      state.appointmentAnalytics = action.payload.appointmentAnalytics;
      state.billingRevenue = action.payload.billingRevenue;
      state.prescriptionTrends = action.payload.prescriptionTrends;
      state.financialSummary = action.payload.financialSummary;
      state.occupancyRate = action.payload.occupancyRate;
      state.loading = false;
      state.error = null;
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch individual analytics
    fetchPatientDemographicsStart: (state) => {
      state.loading = true;
    },
    fetchPatientDemographicsSuccess: (state, action) => {
      state.patientDemographics = action.payload;
      state.loading = false;
    },
    fetchPatientDemographicsFailure: (state, action) => {
      state.error = action.payload;
    },

    fetchDoctorPerformanceStart: (state) => {
      state.loading = true;
    },
    fetchDoctorPerformanceSuccess: (state, action) => {
      state.doctorPerformance = action.payload;
      state.loading = false;
    },
    fetchDoctorPerformanceFailure: (state, action) => {
      state.error = action.payload;
    },

    fetchAppointmentAnalyticsStart: (state) => {
      state.loading = true;
    },
    fetchAppointmentAnalyticsSuccess: (state, action) => {
      state.appointmentAnalytics = action.payload;
      state.loading = false;
    },
    fetchAppointmentAnalyticsFailure: (state, action) => {
      state.error = action.payload;
    },

    fetchBillingRevenueStart: (state) => {
      state.loading = true;
    },
    fetchBillingRevenueSuccess: (state, action) => {
      state.billingRevenue = action.payload;
      state.loading = false;
    },
    fetchBillingRevenueFailure: (state, action) => {
      state.error = action.payload;
    },

    fetchPrescriptionTrendsStart: (state) => {
      state.loading = true;
    },
    fetchPrescriptionTrendsSuccess: (state, action) => {
      state.prescriptionTrends = action.payload;
      state.loading = false;
    },
    fetchPrescriptionTrendsFailure: (state, action) => {
      state.error = action.payload;
    },

    fetchFinancialSummaryStart: (state) => {
      state.loading = true;
    },
    fetchFinancialSummarySuccess: (state, action) => {
      state.financialSummary = action.payload;
      state.loading = false;
    },
    fetchFinancialSummaryFailure: (state, action) => {
      state.error = action.payload;
    },

    fetchOccupancyRateStart: (state) => {
      state.loading = true;
    },
    fetchOccupancyRateSuccess: (state, action) => {
      state.occupancyRate = action.payload;
      state.loading = false;
    },
    fetchOccupancyRateFailure: (state, action) => {
      state.error = action.payload;
    },

    // Update date range
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  fetchPatientDemographicsStart,
  fetchPatientDemographicsSuccess,
  fetchPatientDemographicsFailure,
  fetchDoctorPerformanceStart,
  fetchDoctorPerformanceSuccess,
  fetchDoctorPerformanceFailure,
  fetchAppointmentAnalyticsStart,
  fetchAppointmentAnalyticsSuccess,
  fetchAppointmentAnalyticsFailure,
  fetchBillingRevenueStart,
  fetchBillingRevenueSuccess,
  fetchBillingRevenueFailure,
  fetchPrescriptionTrendsStart,
  fetchPrescriptionTrendsSuccess,
  fetchPrescriptionTrendsFailure,
  fetchFinancialSummaryStart,
  fetchFinancialSummarySuccess,
  fetchFinancialSummaryFailure,
  fetchOccupancyRateStart,
  fetchOccupancyRateSuccess,
  fetchOccupancyRateFailure,
  setDateRange,
  clearError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
