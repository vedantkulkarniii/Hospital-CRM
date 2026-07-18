'use strict';

const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Notification Service — all notification business logic.
 */

/**
 * Create a new notification (T-141).
 * @param {object} notificationData - Notification details
 * @param {string} userId - ID of the user creating the notification (optional)
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationData, userId = null) => {
  const notification = await Notification.create({
    ...notificationData,
    createdBy: userId,
  });

  // Populate recipient info
  await notification.populate('recipient', 'firstName lastName email phone');

  // Send notifications via configured channels
  await sendNotificationViaChannels(notification);

  logger.info(`Notification created: ${notification._id} for user ${notificationData.recipient}`);
  return notification;
};

/**
 * Send notifications via configured channels (T-142).
 * @param {object} notification - Notification document
 */
const sendNotificationViaChannels = async (notification) => {
  try {
    // In-app notification (always mark as delivered)
    if (notification.channels.inApp) {
      notification.deliveryStatus.inApp.status = 'delivered';
      notification.deliveryStatus.inApp.deliveredAt = new Date();
    }

    // Email notification
    if (notification.channels.email && notification.recipient?.email) {
      try {
        await sendEmailNotification(notification);
        notification.deliveryStatus.email.status = 'sent';
        notification.deliveryStatus.email.sentAt = new Date();
      } catch (error) {
        notification.deliveryStatus.email.status = 'failed';
        notification.deliveryStatus.email.failureReason = error.message;
        logger.error(`Email notification failed: ${error.message}`);
      }
    }

    // SMS notification (placeholder - would require SMS service like Twilio)
    if (notification.channels.sms && notification.recipient?.phone) {
      try {
        // await sendSMSNotification(notification);
        notification.deliveryStatus.sms.status = 'sent';
        notification.deliveryStatus.sms.sentAt = new Date();
      } catch (error) {
        notification.deliveryStatus.sms.status = 'failed';
        notification.deliveryStatus.sms.failureReason = error.message;
      }
    }

    // Push notification (placeholder - would require push service)
    if (notification.channels.push) {
      try {
        // await sendPushNotification(notification);
        notification.deliveryStatus.push.status = 'sent';
        notification.deliveryStatus.push.sentAt = new Date();
      } catch (error) {
        notification.deliveryStatus.push.status = 'failed';
        notification.deliveryStatus.push.failureReason = error.message;
      }
    }

    await notification.save();
  } catch (error) {
    logger.error(`Error sending notifications: ${error.message}`);
  }
};

/**
 * Send email notification
 */
const sendEmailNotification = async (notification) => {
  const recipient = notification.recipient;
  if (!recipient?.email) {
    throw new Error('Recipient email not found');
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@hospitalcrm.com',
    to: recipient.email,
    subject: notification.title,
    html: `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Hospital CRM System
      </p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Get notifications for a user (T-143).
 * @param {string} userId - User MongoDB ID
 * @param {object} options - { page, limit, isRead, type }
 * @returns {Promise<{ notifications, total }>}
 */
const getUserNotifications = async (userId, { page = 1, limit = 10, isRead, type } = {}) => {
  const query = { recipient: userId };

  if (isRead !== undefined) {
    query.isRead = isRead;
  }

  if (type) {
    query.type = type;
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .populate('recipient', 'firstName lastName')
      .sort('-createdAt')
      .skip(skip)
      .limit(parsedLimit),
    Notification.countDocuments(query),
  ]);

  return { notifications, total, page: parsedPage, limit: parsedLimit };
};

/**
 * Get unread notification count (T-143).
 * @param {string} userId - User MongoDB ID
 * @returns {Promise<number>}
 */
const getUnreadCount = async (userId) => {
  return Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

/**
 * Mark notification as read (T-144).
 * @param {string} notificationId - Notification MongoDB ID
 * @returns {Promise<Notification>}
 */
const markAsRead = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      isRead: true,
      readAt: new Date(),
    },
    { new: true },
  ).populate('recipient', 'firstName lastName');

  if (!notification) {
    const error = new Error('Notification not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Notification marked as read: ${notificationId}`);
  return notification;
};

/**
 * Mark all notifications as read for a user (T-144).
 * @param {string} userId - User MongoDB ID
 * @returns {Promise<{ modifiedCount }>}
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    {
      isRead: true,
      readAt: new Date(),
    },
  );

  logger.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
  return result;
};

/**
 * Delete a notification (T-145).
 * @param {string} notificationId - Notification MongoDB ID
 * @returns {Promise<Notification>}
 */
const deleteNotification = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!notification) {
    const error = new Error('Notification not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Notification soft deleted: ${notificationId}`);
  return notification;
};

/**
 * Delete all notifications for a user
 */
const deleteAllUserNotifications = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
  );

  logger.info(`Deleted ${result.modifiedCount} notifications for user ${userId}`);
  return result;
};

/**
 * Send bulk notifications to multiple users
 */
const sendBulkNotifications = async (recipientIds, notificationData, userId = null) => {
  const notifications = [];

  for (const recipientId of recipientIds) {
    try {
      const notification = await createNotification(
        { ...notificationData, recipient: recipientId },
        userId,
      );
      notifications.push(notification);
    } catch (error) {
      logger.error(`Failed to send notification to user ${recipientId}: ${error.message}`);
    }
  }

  return notifications;
};

/**
 * Get notification statistics for a user
 */
const getNotificationStats = async (userId) => {
  const stats = await Notification.aggregate([
    {
      $match: {
        recipient: mongoose.Types.ObjectId(userId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalNotifications: { $sum: 1 },
        unreadCount: {
          $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
        },
        byType: {
          $push: {
            type: '$type',
            count: 1,
          },
        },
      },
    },
  ]);

  return stats.length > 0
    ? stats[0]
    : {
      totalNotifications: 0,
      unreadCount: 0,
      byType: [],
    };
};

module.exports = {
  createNotification,
  sendNotificationViaChannels,
  sendEmailNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllUserNotifications,
  sendBulkNotifications,
  getNotificationStats,
};
