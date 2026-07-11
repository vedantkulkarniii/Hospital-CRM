'use strict';

const notificationService = require('../services/notification.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new notification.
 * @route POST /api/notifications
 */
const createNotification = async (req, res, next) => {
  try {
    const notificationData = req.body;
    const userId = req.user._id || req.user.id;

    const notification = await notificationService.createNotification(notificationData, userId);

    return sendSuccess(res, 201, 'Notification created successfully.', notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Get notifications for current user.
 * @route GET /api/notifications/me/list
 */
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { page, limit, isRead, type } = req.query;

    const { notifications, total, page: currentPage, limit: currentLimit } = await notificationService.getUserNotifications(
      userId,
      {
        page,
        limit,
        isRead: isRead ? isRead === 'true' : undefined,
        type,
      },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Notifications retrieved successfully.', notifications, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notification count for current user.
 * @route GET /api/notifications/me/unread-count
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const count = await notificationService.getUnreadCount(userId);

    return sendSuccess(res, 200, 'Unread notification count retrieved.', { unreadCount: count });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a notification as read.
 * @route PUT /api/notifications/:id/read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);

    return sendSuccess(res, 200, 'Notification marked as read.', notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read for current user.
 * @route PUT /api/notifications/me/read-all
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const result = await notificationService.markAllAsRead(userId);

    return sendSuccess(res, 200, `${result.modifiedCount} notifications marked as read.`, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification.
 * @route DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.deleteNotification(id);

    return sendSuccess(res, 200, 'Notification deleted successfully.', notification);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all notifications for current user.
 * @route DELETE /api/notifications/me/delete-all
 */
const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const result = await notificationService.deleteAllUserNotifications(userId);

    return sendSuccess(res, 200, `${result.modifiedCount} notifications deleted.`, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Send bulk notifications.
 * @route POST /api/notifications/bulk
 */
const sendBulkNotifications = async (req, res, next) => {
  try {
    const { recipientIds, notificationData } = req.body;
    const userId = req.user._id || req.user.id;

    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return sendSuccess(res, 400, 'Invalid recipient IDs.');
    }

    const notifications = await notificationService.sendBulkNotifications(
      recipientIds,
      notificationData,
      userId,
    );

    return sendSuccess(res, 201, `${notifications.length} notifications sent.`, notifications);
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification statistics for current user.
 * @route GET /api/notifications/me/stats
 */
const getNotificationStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const stats = await notificationService.getNotificationStats(userId);

    return sendSuccess(res, 200, 'Notification statistics retrieved.', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  sendBulkNotifications,
  getNotificationStats,
};
