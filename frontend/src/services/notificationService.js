import api from './api.js';

/**
 * Notification API service — wraps all /api/notifications endpoints.
 */
export const notificationService = {
  /**
   * Create a new notification (admin only).
   * @param {object} data - Notification details
   */
  createNotification: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  /**
   * Get current user's notifications.
   * @param {object} params - { page, limit, isRead, type }
   */
  getUserNotifications: async (params) => {
    const response = await api.get('/notifications/me/list', { params });
    return response.data;
  },

  /**
   * Get unread notification count for current user.
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/me/unread-count');
    return response.data;
  },

  /**
   * Get notification statistics for current user.
   */
  getNotificationStats: async () => {
    const response = await api.get('/notifications/me/stats');
    return response.data;
  },

  /**
   * Mark a notification as read.
   * @param {string} id - Notification ID
   */
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: async () => {
    const response = await api.put('/notifications/me/read-all');
    return response.data;
  },

  /**
   * Delete a notification.
   * @param {string} id - Notification ID
   */
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Delete all notifications.
   */
  deleteAllNotifications: async () => {
    const response = await api.delete('/notifications/me/delete-all');
    return response.data;
  },

  /**
   * Send bulk notifications (admin only).
   * @param {array} recipientIds - Array of user IDs
   * @param {object} notificationData - Notification details
   */
  sendBulkNotifications: async (recipientIds, notificationData) => {
    const response = await api.post('/notifications/bulk', {
      recipientIds,
      notificationData,
    });
    return response.data;
  },
};

export default notificationService;
