import axios from 'axios';
import { store } from '../store/index.js';
import { setCredentials, logout } from '../store/slices/authSlice.js';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Main Axios instance — used for all authenticated API calls.
 * Automatically attaches the access token from Redux store.
 */
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends httpOnly refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the current access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle 401 errors by attempting a silent token refresh.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 errors that haven't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the access token
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const { accessToken, user } = response.data.data;

        // Update store with new credentials
        store.dispatch(setCredentials({ user, accessToken }));

        // Retry all queued requests with new token
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — log the user out
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
