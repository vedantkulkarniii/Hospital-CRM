import api from './api.js';

/**
 * Auth API service — wraps all /api/auth endpoints.
 */

export const authService = {
  /**
   * Register a new user account.
   * @param {{ firstName, lastName, email, password, role?, phone? }} data
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Log in with email and password.
   * @param {{ email, password }} credentials
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Log out from the current session.
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Log out from ALL devices.
   */
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },

  /**
   * Silently refresh the access token using the httpOnly cookie.
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  /**
   * Get the current authenticated user's profile.
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Request a password reset email.
   * @param {string} email
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password using a token from the reset email.
   * @param {string} token
   * @param {string} password
   */
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};
