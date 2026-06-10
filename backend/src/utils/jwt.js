'use strict';

const jwt = require('jsonwebtoken');

/**
 * Sign a short-lived access token.
 * @param {object} payload - { id, role }
 * @returns {string} signed JWT
 */
const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'hospital-crm',
    audience: 'hospital-crm-client',
  });
};

/**
 * Sign a long-lived refresh token.
 * @param {object} payload - { id }
 * @returns {string} signed JWT
 */
const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'hospital-crm',
    audience: 'hospital-crm-client',
  });
};

/**
 * Verify an access token.
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'hospital-crm',
    audience: 'hospital-crm-client',
  });
};

/**
 * Verify a refresh token.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: 'hospital-crm',
    audience: 'hospital-crm-client',
  });
};

/**
 * Decode a token without verifying — for inspection only.
 * @param {string} token
 * @returns {object|null}
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
