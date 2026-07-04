import api from './api.js';

/**
 * Patient API service — wraps all /api/patients endpoints.
 */
export const patientService = {
  /**
   * Create a new patient record.
   * @param {object} data - Patient details
   */
  createPatient: async (data) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  /**
   * Get all patients with filters and pagination.
   * @param {object} params - { page, limit, search, gender, bloodGroup, sort }
   */
  getPatients: async (params) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  /**
   * Get a patient by ID.
   * @param {string} id - Patient MongoDB ID
   */
  getPatientById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  /**
   * Update a patient record.
   * @param {string} id - Patient MongoDB ID
   * @param {object} data - Updated details
   */
  updatePatient: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  /**
   * Soft delete a patient record.
   * @param {string} id - Patient MongoDB ID
   */
  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

export default patientService;
