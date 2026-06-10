import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  setCredentials,
  setLoading,
  setError,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../store/slices/authSlice.js';
import { authService } from '../services/auth.service.js';

/**
 * useAuth — central hook for all authentication operations.
 * Keeps UI, Redux state, and API calls in sync.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = async (formData) => {
    dispatch(setLoading(true));
    try {
      const result = await authService.register(formData);
      dispatch(setCredentials({ user: result.data.user, accessToken: result.data.accessToken }));
      toast.success('Account created successfully!');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      dispatch(setError(message));
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    dispatch(setLoading(true));
    try {
      const result = await authService.login(credentials);
      dispatch(setCredentials({ user: result.data.user, accessToken: result.data.accessToken }));
      toast.success(`Welcome back, ${result.data.user.firstName}!`);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch(setError(message));
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    dispatch(setLoading(true));
    try {
      await authService.logout();
    } catch {
      // Ignore errors — proceed with client-side logout regardless
    } finally {
      dispatch(logoutAction());
      navigate('/login');
      toast.success('Logged out successfully.');
    }
  };

  // ─── Forgot Password ─────────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    dispatch(setLoading(true));
    try {
      await authService.forgotPassword(email);
      toast.success('If that email exists, a reset link has been sent.');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ─── Reset Password ──────────────────────────────────────────────────────────
  const resetPassword = async (token, password) => {
    dispatch(setLoading(true));
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset successfully. Please log in.');
      navigate('/login');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Reset failed. The link may have expired.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };
};
