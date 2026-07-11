'use strict';

const express = require('express');

const notificationController = require('../controllers/notification.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const notificationValidators = require('../middleware/validators/notification.validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's notifications (must come before :id route)
router.get(
  '/me/list',
  notificationController.getUserNotifications,
);

// Get unread notification count
router.get(
  '/me/unread-count',
  notificationController.getUnreadCount,
);

// Get notification statistics
router.get(
  '/me/stats',
  notificationController.getNotificationStats,
);

// Mark all as read
router.put(
  '/me/read-all',
  notificationController.markAllAsRead,
);

// Delete all notifications
router.delete(
  '/me/delete-all',
  notificationController.deleteAllNotifications,
);

// Send bulk notifications (admin only)
router.post(
  '/bulk',
  authorize('admin'),
  notificationController.sendBulkNotifications,
);

// Create notification (admin only)
router.post(
  '/',
  authorize('admin'),
  notificationValidators.createNotification,
  validate,
  notificationController.createNotification,
);

// Mark notification as read
router.put(
  '/:id/read',
  notificationValidators.validateNotificationId,
  validate,
  notificationController.markAsRead,
);

// Delete notification
router.delete(
  '/:id',
  notificationValidators.validateNotificationId,
  validate,
  notificationController.deleteNotification,
);

module.exports = router;
