import api from './api.js';

/**
 * Appointment API service — wraps all /api/appointments endpoints.
 */
export const appointmentService = {
  /**
   * Create a new appointment.
   * @param {object} data - Appointment details
   */
  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  /**
   * Get all appointments with filters and pagination.
   * @param {object} params - { page, limit, search, date, doctor, patient, status, sort }
   */
  getAppointments: async (params) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  /**
   * Get a single appointment by ID.
   * @param {string} id - Appointment MongoDB ID
   */
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Get today's appointments.
   * @param {object} params - { page, limit }
   */
  getTodayAppointments: async (params) => {
    const response = await api.get('/appointments/today', { params });
    return response.data;
  },

  /**
   * Get appointments by date range.
   * @param {object} params - { startDate, endDate, page, limit }
   */
  getAppointmentsByDateRange: async (params) => {
    const response = await api.get('/appointments/range', { params });
    return response.data;
  },

  /**
   * Update an appointment.
   * @param {string} id - Appointment MongoDB ID
   * @param {object} data - Updated details
   */
  updateAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Cancel an appointment.
   * @param {string} id - Appointment MongoDB ID
   * @param {object} data - { cancellationReason }
   */
  cancelAppointment: async (id, data) => {
    const response = await api.patch(`/appointments/${id}/cancel`, data);
    return response.data;
  },

  /**
   * Delete an appointment (soft delete).
   * @param {string} id - Appointment MongoDB ID
   */
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default appointmentService;
