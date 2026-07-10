import api from './api.js';

/**
 * Bill API service — wraps all /api/bills endpoints.
 */
export const billService = {
  /**
   * Create a new bill.
   * @param {object} data - Bill details
   */
  createBill: async (data) => {
    const response = await api.post('/bills', data);
    return response.data;
  },

  /**
   * Get all bills with filters and pagination.
   * @param {object} params - { page, limit, search, patient, status, sort }
   */
  getBills: async (params) => {
    const response = await api.get('/bills', { params });
    return response.data;
  },

  /**
   * Get a single bill by ID.
   * @param {string} id - Bill MongoDB ID
   */
  getBillById: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  /**
   * Get bills by patient.
   * @param {string} patientId - Patient MongoDB ID
   * @param {object} params - { page, limit }
   */
  getBillsByPatient: async (patientId, params) => {
    const response = await api.get(`/bills/patient/${patientId}`, { params });
    return response.data;
  },

  /**
   * Get bills by status.
   * @param {string} status - Bill status (pending, partial, paid, overdue, cancelled)
   * @param {object} params - { page, limit }
   */
  getBillsByStatus: async (status, params) => {
    const response = await api.get(`/bills/status/${status}`, { params });
    return response.data;
  },

  /**
   * Get billing statistics.
   */
  getBillingStats: async () => {
    const response = await api.get('/bills/stats/dashboard');
    return response.data;
  },

  /**
   * Update a bill.
   * @param {string} id - Bill MongoDB ID
   * @param {object} data - Updated details
   */
  updateBill: async (id, data) => {
    const response = await api.put(`/bills/${id}`, data);
    return response.data;
  },

  /**
   * Update bill payment.
   * @param {string} id - Bill MongoDB ID
   * @param {object} data - { paidAmount, paymentMethod, transactionId }
   */
  updateBillPayment: async (id, data) => {
    const response = await api.put(`/bills/${id}/payment`, data);
    return response.data;
  },

  /**
   * Delete a bill (soft delete).
   * @param {string} id - Bill MongoDB ID
   */
  deleteBill: async (id) => {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },
};

export default billService;
