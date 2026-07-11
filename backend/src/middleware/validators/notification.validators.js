'use strict';

const { body, param } = require('express-validator');

/**
 * Notification Validators — reusable validation chains for notification operations.
 */

const notificationValidators = {
  /**
   * Validate notification creation
   */
  createNotification: [
    body('recipient')
      .notEmpty().withMessage('Recipient user ID is required.')
      .isMongoId().withMessage('Invalid recipient ID format.'),
    body('type')
      .notEmpty().withMessage('Notification type is required.')
      .isIn([
        'appointment_booked',
        'appointment_confirmed',
        'appointment_cancelled',
        'appointment_reminder',
        'appointment_completed',
        'prescription_issued',
        'bill_generated',
        'bill_paid',
        'payment_reminder',
        'document_available',
        'system_alert',
        'general_message',
      ])
      .withMessage('Invalid notification type.'),
    body('title')
      .notEmpty().withMessage('Notification title is required.')
      .trim()
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),
    body('message')
      .notEmpty().withMessage('Notification message is required.')
      .trim()
      .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters.'),
    body('channels')
      .optional()
      .isObject().withMessage('Channels must be an object.'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority level.'),
  ],

  /**
   * Validate notification ID parameter
   */
  validateNotificationId: [
    param('id')
      .isMongoId().withMessage('Invalid notification ID format.'),
  ],
};

module.exports = notificationValidators;
