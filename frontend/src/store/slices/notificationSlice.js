import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    isRead: null,
    type: '',
  },
  stats: {
    totalNotifications: 0,
    unreadCount: 0,
    byType: [],
  },
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Fetch notifications
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.notifications = action.payload.data || [];
      state.pagination = {
        page: action.payload.pagination?.page || 1,
        limit: action.payload.pagination?.limit || 10,
        total: action.payload.pagination?.total || 0,
      };
      state.loading = false;
      state.error = null;
    },
    fetchNotificationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch unread count
    fetchUnreadCountStart: (state) => {
      state.loading = true;
    },
    fetchUnreadCountSuccess: (state, action) => {
      state.unreadCount = action.payload.unreadCount || 0;
      state.loading = false;
    },
    fetchUnreadCountFailure: (state, action) => {
      state.error = action.payload;
    },

    // Mark notification as read
    markAsReadStart: (state) => {
      state.loading = true;
    },
    markAsReadSuccess: (state, action) => {
      const notification = state.notifications.find((n) => n._id === action.payload._id);
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date();
      }
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
      state.loading = false;
    },
    markAsReadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Mark all as read
    markAllAsReadStart: (state) => {
      state.loading = true;
    },
    markAllAsReadSuccess: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
        n.readAt = new Date();
      });
      state.unreadCount = 0;
      state.loading = false;
    },
    markAllAsReadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete notification
    deleteNotificationStart: (state) => {
      state.loading = true;
    },
    deleteNotificationSuccess: (state, action) => {
      state.notifications = state.notifications.filter((n) => n._id !== action.payload._id);
      state.pagination.total -= 1;
      state.loading = false;
    },
    deleteNotificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete all notifications
    deleteAllStart: (state) => {
      state.loading = true;
    },
    deleteAllSuccess: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.pagination.total = 0;
      state.loading = false;
    },
    deleteAllFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create notification
    createNotificationStart: (state) => {
      state.loading = true;
    },
    createNotificationSuccess: (state, action) => {
      state.notifications.unshift(action.payload);
      state.pagination.total += 1;
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
      state.loading = false;
    },
    createNotificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },

    // Update pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Real-time notification (WebSocket)
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },

    // Fetch stats
    fetchStatsStart: (state) => {
      state.loading = true;
    },
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload || initialState.stats;
      state.loading = false;
    },
    fetchStatsFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchUnreadCountStart,
  fetchUnreadCountSuccess,
  fetchUnreadCountFailure,
  markAsReadStart,
  markAsReadSuccess,
  markAsReadFailure,
  markAllAsReadStart,
  markAllAsReadSuccess,
  markAllAsReadFailure,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteNotificationFailure,
  deleteAllStart,
  deleteAllSuccess,
  deleteAllFailure,
  createNotificationStart,
  createNotificationSuccess,
  createNotificationFailure,
  setFilters,
  setPagination,
  clearError,
  addNotification,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;
