import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Trash2, Check } from 'lucide-react';
import notificationService from '../../services/notificationService.js';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  setFilters,
  setPagination,
  markAsReadStart,
  markAsReadSuccess,
  deleteNotificationStart,
  deleteNotificationSuccess,
} from '../../store/slices/notificationSlice.js';
import Table from '../../components/common/Table.jsx';
import Alert from '../../components/common/Alert.jsx';

const getNotificationTypeColor = (type) => {
  switch (type) {
    case 'appointment_booked':
    case 'appointment_confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'appointment_cancelled':
      return 'bg-red-100 text-red-800';
    case 'prescription_issued':
      return 'bg-green-100 text-green-800';
    case 'bill_generated':
    case 'bill_paid':
      return 'bg-purple-100 text-purple-800';
    case 'payment_reminder':
      return 'bg-yellow-100 text-yellow-800';
    case 'system_alert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
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
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, loading, error, pagination, filters } = useSelector((state) => state.notification);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, [pagination.page, pagination.limit, filters]);

  const fetchNotifications = async () => {
    try {
      dispatch(fetchNotificationsStart());
      const response = await notificationService.getUserNotifications({
        page: pagination.page,
        limit: pagination.limit,
        isRead: filters.isRead === null ? undefined : filters.isRead,
        type: filters.type,
      });

      dispatch(
        fetchNotificationsSuccess({
          data: response.data,
          pagination: response.meta,
        }),
      );
    } catch (err) {
      dispatch(fetchNotificationsFailure(err.response?.data?.message || 'Failed to fetch notifications'));
    }
  };

  const handleSearch = (value) => {
    // Search is implemented via filtering in the component
    // For now, just filter by type or read status
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead) return;

    try {
      dispatch(markAsReadStart());
      const response = await notificationService.markAsRead(notification._id);
      dispatch(markAsReadSuccess(response.data));
      setSuccessMessage('Notification marked as read');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDelete = async (notification) => {
    if (window.confirm('Delete this notification?')) {
      try {
        dispatch(deleteNotificationStart());
        const response = await notificationService.deleteNotification(notification._id);
        dispatch(deleteNotificationSuccess(response.data));
        setSuccessMessage('Notification deleted');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    }
  };

  const columns = [
    {
      label: 'Type',
      key: 'type',
      render: (notification) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getNotificationTypeColor(notification.type)}`}>
          {getNotificationTypeLabel(notification.type)}
        </span>
      ),
    },
    {
      label: 'Title',
      key: 'title',
    },
    {
      label: 'Message',
      key: 'message',
      render: (notification) => notification.message.substring(0, 50) + '...',
    },
    {
      label: 'Priority',
      key: 'priority',
      render: (notification) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(notification.priority)}`}>
          {notification.priority?.charAt(0).toUpperCase() + notification.priority?.slice(1)}
        </span>
      ),
    },
    {
      label: 'Status',
      key: 'isRead',
      render: (notification) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${notification.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {notification.isRead ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (notification) => new Date(notification.createdAt).toLocaleDateString(),
    },
  ];

  const actions = (notification) => (
    <div className="flex gap-2">
      {!notification.isRead && (
        <button
          onClick={() => handleMarkAsRead(notification)}
          className="text-blue-600 hover:text-blue-900"
          title="Mark as read"
        >
          <Check size={16} />
        </button>
      )}
      <button
        onClick={() => handleDelete(notification)}
        className="text-red-600 hover:text-red-900"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">Manage your notifications and alerts</p>
      </div>

      {/* Alerts */}
      {successMessage && <Alert type="success" message={successMessage} />}
      {error && <Alert type="error" message={error} />}

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Read Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.isRead === null ? '' : filters.isRead ? 'read' : 'unread'}
              onChange={(e) => {
                if (e.target.value === '') {
                  handleFilterChange('isRead', null);
                } else {
                  handleFilterChange('isRead', e.target.value === 'read');
                }
              }}
            >
              <option value="">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
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
        </div>
      </div>

      {/* Notifications Table */}
      <div className="card">
        <Table columns={columns} data={notifications} actions={actions} loading={loading} />
      </div>

      {/* Pagination */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {notifications.length} of {pagination.total} notifications
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(setPagination({ page: pagination.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => dispatch(setPagination({ page: pagination.page + 1 }))}
              disabled={pagination.page * pagination.limit >= pagination.total || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
