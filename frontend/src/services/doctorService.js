import api from './api.js';

/**
 * Doctor API service — wraps all /api/doctors endpoints.
 */
export const doctorService = {
  /**
   * Create a new doctor profile.
   * @param {object} data - Doctor details
   */
  createDoctor: async (data) => {
    const response = await api.post('/doctors', data);
    return response.data;
  },

  /**
   * Get all doctors with filters and pagination.
   * @param {object} params - { page, limit, search, specialization, isVerified, sort }
   */
  getDoctors: async (params) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  /**
   * Get a doctor by ID.
   * @param {string} id - Doctor MongoDB ID
   */
  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  /**
   * Get the current authenticated doctor's profile.
   */
  getMyDoctorProfile: async () => {
    const response = await api.get('/doctors/profile/me');
    return response.data;
  },

  /**
   * Get doctors by specialization.
   * @param {string} specialization - Doctor specialization
   * @param {object} params - { page, limit }
   */
  getDoctorsBySpecialization: async (specialization, params) => {
    const response = await api.get(`/doctors/specialization/${specialization}`, { params });
    return response.data;
  },

  /**
   * Update a doctor record.
   * @param {string} id - Doctor MongoDB ID
   * @param {object} data - Updated details
   */
  updateDoctor: async (id, data) => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },

  /**
   * Soft delete a doctor record.
   * @param {string} id - Doctor MongoDB ID
   */
  deleteDoctor: async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },
};

export default doctorService;
