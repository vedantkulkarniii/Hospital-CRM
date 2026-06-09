'use strict';

/**
 * Standardized API response helpers.
 * All controllers should use these to ensure a consistent response shape.
 */

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {string} message - Human-readable message
 * @param {*} data - Response payload
 * @param {object} meta - Optional pagination / extra metadata
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {string} message - Error message
 * @param {Array} errors - Optional validation error details
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

/**
 * Build pagination meta object.
 * @param {number} total - Total document count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page: Number(page),
  limit: Number(limit),
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { sendSuccess, sendError, paginationMeta };
