'use strict';

const { body, param } = require('express-validator');

/**
 * Report Validators — reusable validation chains for report operations.
 */

const reportValidators = {
  /**
   * Validate analytics query parameters
   */
  validateAnalyticsQuery: [
    body('startDate')
      .optional()
      .isISO8601().withMessage('Start date must be a valid date.'),
    body('endDate')
      .optional()
      .isISO8601().withMessage('End date must be a valid date.'),
  ],

  /**
   * Validate report ID parameter
   */
  validateReportId: [
    param('id')
      .isMongoId().withMessage('Invalid report ID format.'),
  ],
};

module.exports = reportValidators;
