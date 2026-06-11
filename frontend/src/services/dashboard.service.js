import api from './api';

/**
 * Dashboard Service — all dashboard-related API calls
 */

export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats based on user role
   */
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get recent appointments (placeholder for when Appointment model is ready)
   * @returns {Promise} List of recent appointments
   */
  getRecentAppointments: async (limit = 5) => {
    try {
      const response = await api.get(`/appointments?limit=${limit}&sort=-createdAt`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent appointments:', error);
      throw error;
    }
  },

  /**
   * Get recent patients (placeholder for when Patient model is ready)
   * @returns {Promise} List of recently added patients
   */
  getRecentPatients: async (limit = 5) => {
    try {
      const response = await api.get(`/patients?limit=${limit}&sort=-createdAt`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent patients:', error);
      throw error;
    }
  },

  /**
   * Get appointment trends (placeholder for analytics)
   * @returns {Promise} Appointment trend data for charts
   */
  getAppointmentTrends: async (days = 7) => {
    try {
      const response = await api.get(`/dashboard/trends?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment trends:', error);
      throw error;
    }
  },
};

export default dashboardService;
