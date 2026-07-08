import api from './api.js';

/**
 * Prescription API service — wraps all /api/prescriptions endpoints.
 */
export const prescriptionService = {
  /**
   * Create a new prescription.
   * @param {object} data - Prescription details
   */
  createPrescription: async (data) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },

  /**
   * Get all prescriptions with filters and pagination.
   * @param {object} params - { page, limit, search, patient, doctor, sort }
   */
  getPrescriptions: async (params) => {
    const response = await api.get('/prescriptions', { params });
    return response.data;
  },

  /**
   * Get a single prescription by ID.
   * @param {string} id - Prescription MongoDB ID
   */
  getPrescriptionById: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  /**
   * Get prescriptions by patient.
   * @param {string} patientId - Patient MongoDB ID
   * @param {object} params - { page, limit }
   */
  getPrescriptionsByPatient: async (patientId, params) => {
    const response = await api.get(`/prescriptions/patient/${patientId}`, { params });
    return response.data;
  },

  /**
   * Get prescriptions by doctor.
   * @param {string} doctorId - Doctor MongoDB ID
   * @param {object} params - { page, limit }
   */
  getPrescriptionsByDoctor: async (doctorId, params) => {
    const response = await api.get(`/prescriptions/doctor/${doctorId}`, { params });
    return response.data;
  },

  /**
   * Update a prescription.
   * @param {string} id - Prescription MongoDB ID
   * @param {object} data - Updated details
   */
  updatePrescription: async (id, data) => {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a prescription (soft delete).
   * @param {string} id - Prescription MongoDB ID
   */
  deletePrescription: async (id) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  },

  /**
   * Export a prescription as PDF.
   * @param {string} id - Prescription MongoDB ID
   */
  exportPrescriptionPDF: async (id) => {
    const response = await api.get(`/prescriptions/${id}/export-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default prescriptionService;
