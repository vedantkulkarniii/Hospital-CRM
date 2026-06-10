'use strict';

const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Cookie options for refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/api/auth',
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    const { user, accessToken, refreshToken } = await authService.register({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return sendSuccess(res, 201, 'Account created successfully.', { user, accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login({ email, password });

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return sendSuccess(res, 200, 'Logged in successfully.', { user, accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Reads refresh token from cookie, issues new access + refresh token pair.
 */
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return sendError(res, 401, 'No refresh token provided. Please log in.');
    }

    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

    // Rotate cookie
    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return sendSuccess(res, 200, 'Token refreshed.', { user, accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const userId = req.user?._id;

    if (userId && refreshToken) {
      await authService.logout(userId, refreshToken);
    }

    // Clear the cookie
    res.clearCookie('refreshToken', { path: '/api/auth' });

    return sendSuccess(res, 200, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout-all
 * Invalidates all sessions for the authenticated user.
 */
const logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAll(req.user._id);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    return sendSuccess(res, 200, 'All sessions terminated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile.
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User profile retrieved.', { user: req.user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    // In production we would send the token via email here.
    // For now, log it (development only) and return a generic success.
    if (result && process.env.NODE_ENV !== 'production') {
      logger.debug(`[DEV] Password reset token for ${email}: ${result.resetToken}`);
    }

    // Always return success to prevent email enumeration
    return sendSuccess(
      res,
      200,
      'If an account with that email exists, a reset link has been sent.',
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password/:token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    return sendSuccess(res, 200, 'Password reset successfully. Please log in with your new password.');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout, logoutAll, getMe, forgotPassword, resetPassword };
