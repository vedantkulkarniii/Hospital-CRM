import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, X, Check, Trash2, Filter } from 'lucide-react';
import notificationService from '../../services/notificationService.js';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchUnreadCountStart,
  fetchUnreadCountSuccess,
  markAsReadStart,
  markAsReadSuccess,
  markAllAsReadStart,
  markAllAsReadSuccess,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteAllStart,
  deleteAllSuccess,
  setFilters,
} from '../../store/slices/notificationSlice.js';

const getNotificationTypeColor = (type) => {
  switch (type) {
    case 'appointment_booked':
    case 'appointment_confirmed':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'appointment_cancelled':
      return 'bg-red-50 text-red-800 border-red-200';
    case 'prescription_issued':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'bill_generated':
    case 'bill_paid':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'payment_reminder':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'system_alert':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

const getNotificationTypeLabel = (type) => {
  const labels = {
    appointment_booked: 'Appointment Booked',
    appointment_confirmed: 'Appointment Confirmed',
    appointment_cancelled: 'Appointment Cancelled',
    appointment_reminder: 'Appointment Reminder',
    appointment_completed: 'Appointment Completed',
    prescription_issued: 'Prescription Issued',
    bill_generated: 'Bill Generated',
    bill_paid: 'Bill Paid',
    payment_reminder: 'Payment Reminder',
    document_available: 'Document Available',
    system_alert: 'System Alert',
    general_message: 'Message',
  };
  return labels[type] || type;
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600';
    case 'high':
      return 'text-orange-600';
    case 'medium':
      return 'text-blue-600';
    case 'low':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, filters } = useSelector((state) => state.notification);
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      dispatch(fetchUnreadCountStart());
      const response = await notificationService.getUnreadCount();
      dispatch(fetchUnreadCountSuccess(response.data));
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      dispatch(fetchNotificationsStart());
      const response = await notificationService.getUserNotifications({
        page: 1,
        limit: 20,
        isRead: filters.isRead,
        type: filters.type,
      });
      dispatch(fetchNotificationsSuccess(response));
    } catch (error) {
      dispatch(fetchNotificationsFailure(error.response?.data?.message || 'Failed to fetch notifications'));
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      dispatch(markAsReadStart());
      const response = await notificationService.markAsRead(notificationId);
      dispatch(markAsReadSuccess(response.data));
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      dispatch(markAllAsReadStart());
      await notificationService.markAllAsRead();
      dispatch(markAllAsReadSuccess());
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      dispatch(deleteNotificationStart());
      const response = await notificationService.deleteNotification(notificationId);
      dispatch(deleteNotificationSuccess(response.data));
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Delete all notifications?')) {
      try {
        dispatch(deleteAllStart());
        await notificationService.deleteAllNotifications();
        dispatch(deleteAllSuccess());
        fetchUnreadCount();
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm mt-1">{unreadCount} unread notifications</p>
            )}
          </div>

          {/* Filters */}
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
              >
                <Filter size={16} />
                Filters
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="ml-auto text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-2 space-y-2">
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="">All Types</option>
                  <option value="appointment_booked">Appointment Booked</option>
                  <option value="appointment_confirmed">Appointment Confirmed</option>
                  <option value="appointment_cancelled">Appointment Cancelled</option>
                  <option value="prescription_issued">Prescription Issued</option>
                  <option value="bill_generated">Bill Generated</option>
                  <option value="bill_paid">Bill Paid</option>
                  <option value="payment_reminder">Payment Reminder</option>
                  <option value="system_alert">System Alert</option>
                </select>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={40} className="mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    } border-l-4 ${
                      !notification.isRead ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                                {getNotificationTypeLabel(notification.type)}
                              </span>
                              {notification.priority !== 'medium' && (
                                <span className={`text-xs font-bold uppercase ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                title="Mark as read"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
              <button
                onClick={handleDeleteAll}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
