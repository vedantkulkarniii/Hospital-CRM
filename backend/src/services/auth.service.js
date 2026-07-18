'use strict';

const crypto = require('crypto');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');

// Helper: hash a refresh token before storing in DB
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new user account.
 * @param {object} data - { firstName, lastName, email, password, role?, phone? }
 * @returns {{ user, accessToken, refreshToken }}
 */
const register = async ({ firstName, lastName, email, password, role, phone }) => {
  // Check duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ firstName, lastName, email, password, role, phone });

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  // Store hashed refresh token
  user.refreshTokens = [hashToken(refreshToken)];
  await user.save({ validateBeforeSave: false });

  logger.info(`New user registered: ${user.email} (${user.role})`);

  return { user: user.toPublicJSON(), accessToken, refreshToken };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user and issue tokens.
 * @param {object} data - { email, password }
 * @returns {{ user, accessToken, refreshToken }}
 */
const login = async ({ email, password }) => {
  // Explicitly select password (it has select:false on schema)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  // Rotate: add new hashed token, keep last 5 sessions
  const hashed = hashToken(refreshToken);
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), hashed];
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info(`User logged in: ${user.email}`);

  return { user: user.toPublicJSON(), accessToken, refreshToken };
};

// ─── Refresh ──────────────────────────────────────────────────────────────────

/**
 * Issue a new access token using a valid refresh token (rotation).
 * @param {string} refreshToken - from httpOnly cookie
 * @returns {{ user, accessToken, refreshToken }}
 */
const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required.');
    error.statusCode = 401;
    throw error;
  }

  // Verify token signature
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    const error = new Error('Invalid or expired refresh token.');
    error.statusCode = 401;
    throw error;
  }

  // Find user and check token exists in DB
  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 401;
    throw error;
  }

  const hashed = hashToken(refreshToken);
  const tokenIndex = user.refreshTokens.indexOf(hashed);

  if (tokenIndex === -1) {
    // Possible token reuse attack — invalidate all sessions
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });
    logger.warn(`Possible refresh token reuse detected for user: ${user.email}`);
    const error = new Error('Refresh token reuse detected. Please log in again.');
    error.statusCode = 401;
    throw error;
  }

  // Rotate: remove old token, issue new pair
  const newAccessToken = signAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user._id });

  user.refreshTokens[tokenIndex] = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicJSON(), accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Invalidate a specific refresh token (logout from current device).
 * @param {string} userId
 * @param {string} refreshToken
 */
const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) {
    return; // silently succeed
  }

  if (refreshToken) {
    const hashed = hashToken(refreshToken);
    user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
  }

  await user.save({ validateBeforeSave: false });
  logger.info(`User logged out: ${user.email}`);
};

// ─── Logout All ───────────────────────────────────────────────────────────────

/**
 * Invalidate ALL refresh tokens for a user (logout from all devices).
 * @param {string} userId
 */
const logoutAll = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshTokens: [] });
  logger.info(`All sessions cleared for user: ${userId}`);
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * Generate a password reset token and store its hash in DB.
 * @param {string} email
 * @returns {string} raw reset token (to be sent via email)
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Don't reveal if email exists — return silently
    return null;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save({ validateBeforeSave: false });

  return { resetToken, user };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

/**
 * Validate reset token and update password.
 * @param {string} rawToken
 * @param {string} newPassword
 */
const resetPassword = async (rawToken, newPassword) => {
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    const error = new Error('Reset token is invalid or has expired.');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.refreshTokens = []; // invalidate all sessions
  await user.save();

  logger.info(`Password reset for user: ${user.email}`);
};

module.exports = { register, login, refresh, logout, logoutAll, forgotPassword, resetPassword };
