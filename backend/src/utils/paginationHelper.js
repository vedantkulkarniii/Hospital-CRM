'use strict';

/**
 * Pagination Helper - Standardizes pagination across all endpoints
 */

/**
 * Parse and validate pagination parameters
 * @param {string|number} page - Page number (default: 1)
 * @param {string|number} limit - Items per page (default: 10, max: 100)
 * @returns {object} {page, limit, skip}
 */
const parsePagination = (page = 1, limit = 10) => {
  const maxLimit = 100;
  const minPage = 1;

  let parsedPage = parseInt(page, 10);
  let parsedLimit = parseInt(limit, 10);

  // Validate page
  if (isNaN(parsedPage) || parsedPage < minPage) {
    parsedPage = minPage;
  }

  // Validate limit
  if (isNaN(parsedLimit) || parsedLimit < 1) {
    parsedLimit = 10;
  }
  if (parsedLimit > maxLimit) {
    parsedLimit = maxLimit;
  }

  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
};

/**
 * Build standardized pagination metadata
 * @param {number} total - Total documents count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page * limit < total;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

/**
 * Standard pagination response builder
 * @param {array} data - Array of documents
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Standard response object
 */
const paginatedResponse = (data, total, page, limit) => ({
  data,
  meta: buildPaginationMeta(total, page, limit),
});

/**
 * Sort option validator and parser
 * @param {string} sortBy - Field to sort by
 * @param {string} order - 'asc' or 'desc' (default: 'desc')
 * @param {array} allowedFields - Allowed fields to sort by
 * @returns {object} MongoDB sort object
 */
const parseSort = (sortBy = 'createdAt', order = 'desc', allowedFields = []) => {
  // Default allowed fields
  const defaultFields = ['createdAt', 'updatedAt', 'name', 'email', 'phone'];
  const validFields = allowedFields.length > 0 ? allowedFields : defaultFields;

  // Validate sortBy is in allowed fields
  if (!validFields.includes(sortBy)) {
    sortBy = 'createdAt';
  }

  // Validate order
  const validOrder = order.toLowerCase() === 'asc' ? 1 : -1;

  return { [sortBy]: validOrder };
};

/**
 * Build filter query from common parameters
 * @param {object} params - Query parameters
 * @returns {object} MongoDB query object
 */
const buildFilterQuery = (params) => {
  const query = {};

  // Search in multiple fields
  if (params.search) {
    query.$or = [
      { name: { $regex: params.search, $options: 'i' } },
      { email: { $regex: params.search, $options: 'i' } },
      { phone: { $regex: params.search, $options: 'i' } },
    ];
  }

  // Filter by status
  if (params.status) {
    query.status = params.status;
  }

  // Filter by category
  if (params.category) {
    query.category = params.category;
  }

  // Filter by date range
  if (params.startDate || params.endDate) {
    query.createdAt = {};
    if (params.startDate) {
      query.createdAt.$gte = new Date(params.startDate);
    }
    if (params.endDate) {
      query.createdAt.$lte = new Date(params.endDate);
    }
  }

  return query;
};

module.exports = {
  parsePagination,
  buildPaginationMeta,
  paginatedResponse,
  parseSort,
  buildFilterQuery,
};
