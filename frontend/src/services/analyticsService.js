import api from './api.js';

/**
 * Analytics API service — wraps all /api/analytics endpoints.
 */
export const analyticsService = {
  /**
   * Get dashboard analytics.
   * @param {object} params - { startDate, endDate }
   */
  getDashboardAnalytics: async (params) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  /**
   * Get patient demographics analytics.
   * @param {object} params - { startDate, endDate }
   */
  getPatientDemographics: async (params) => {
    const response = await api.get('/analytics/patients', { params });
    return response.data;
  },

  /**
   * Get doctor performance analytics.
   * @param {object} params - { startDate, endDate }
   */
  getDoctorPerformance: async (params) => {
    const response = await api.get('/analytics/doctors', { params });
    return response.data;
  },

  /**
   * Get appointment analytics.
   * @param {object} params - { startDate, endDate }
   */
  getAppointmentAnalytics: async (params) => {
    const response = await api.get('/analytics/appointments', { params });
    return response.data;
  },

  /**
   * Get billing revenue analytics.
   * @param {object} params - { startDate, endDate }
   */
  getBillingRevenue: async (params) => {
    const response = await api.get('/analytics/billing', { params });
    return response.data;
  },

  /**
   * Get prescription trends.
   * @param {object} params - { startDate, endDate }
   */
  getPrescriptionTrends: async (params) => {
    const response = await api.get('/analytics/prescriptions', { params });
    return response.data;
  },

  /**
   * Get financial summary.
   * @param {object} params - { startDate, endDate }
   */
  getFinancialSummary: async (params) => {
    const response = await api.get('/analytics/financial-summary', { params });
    return response.data;
  },

  /**
   * Get occupancy rate.
   * @param {object} params - { startDate, endDate }
   */
  getOccupancyRate: async (params) => {
    const response = await api.get('/analytics/occupancy', { params });
    return response.data;
  },
};

export default analyticsService;
