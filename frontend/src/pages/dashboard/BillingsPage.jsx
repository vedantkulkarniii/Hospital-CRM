import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Trash2, Edit2, DollarSign } from 'lucide-react';
import billService from '../../services/billService.js';
import {
  fetchBillsStart,
  fetchBillsSuccess,
  fetchBillsFailure,
  setFilters,
  setPagination,
  clearCurrentBill,
} from '../../store/slices/billSlice.js';
import Table from '../../components/common/Table.jsx';
import BillFormModal from '../../components/billing/BillFormModal.jsx';
import BillDetailView from '../../components/billing/BillDetailView.jsx';
import Modal from '../../components/common/Modal.jsx';
import Alert from '../../components/common/Alert.jsx';

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'partial':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function BillingsPage() {
  const dispatch = useDispatch();
  const { bills, loading, error, pagination, filters, stats } = useSelector((state) => state.bill);
  const { user } = useSelector((state) => state.auth);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch bills
  useEffect(() => {
    fetchBills();
  }, [pagination.page, pagination.limit, filters]);

  const fetchBills = async () => {
    try {
      dispatch(fetchBillsStart());
      const response = await billService.getBills({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        patient: filters.patient,
      });

      dispatch(
        fetchBillsSuccess({
          data: response.data,
          pagination: response.meta,
        }),
      );
    } catch (err) {
      dispatch(fetchBillsFailure(err.response?.data?.message || 'Failed to fetch bills'));
      setErrorMessage(err.response?.data?.message || 'Failed to fetch bills');
    }
  };

  // Fetch billing stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await billService.getBillingStats();
        // Store stats in Redux
      } catch (err) {
        console.error('Failed to fetch billing stats:', err);
      }
    };
    if (['admin', 'receptionist'].includes(user?.role)) {
      fetchStats();
    }
  }, [user?.role]);

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value }));
  };

  const handleStatusFilter = (value) => {
    dispatch(setFilters({ status: value }));
  };

  const handleAddBill = () => {
    dispatch(clearCurrentBill());
    setSelectedBill(null);
    setShowFormModal(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setShowFormModal(true);
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetailModal(true);
  };

  const handleDeleteBill = async (bill) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billService.deleteBill(bill._id);
        setSuccessMessage('Bill deleted successfully');
        fetchBills();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to delete bill');
      }
    }
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setSelectedBill(null);
  };

  const handleFormSuccess = () => {
    setSuccessMessage('Bill saved successfully');
    handleFormClose();
    fetchBills();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setSelectedBill(null);
  };

  const columns = [
    { label: 'Bill ID', key: 'billId' },
    {
      label: 'Patient',
      key: 'patient',
      render: (bill) => `${bill.patient?.firstName || ''} ${bill.patient?.lastName || ''}`,
    },
    {
      label: 'Amount',
      key: 'totalAmount',
      render: (bill) => `₹${bill.totalAmount?.toFixed(2) || 0}`,
    },
    {
      label: 'Paid',
      key: 'paidAmount',
      render: (bill) => `₹${bill.paidAmount?.toFixed(2) || 0}`,
    },
    {
      label: 'Pending',
      key: 'pendingAmount',
      render: (bill) => `₹${bill.pendingAmount?.toFixed(2) || 0}`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (bill) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(bill.status)}`}>
          {bill.status?.charAt(0).toUpperCase() + bill.status?.slice(1)}
        </span>
      ),
    },
    {
      label: 'Due Date',
      key: 'dueDate',
      render: (bill) => new Date(bill.dueDate).toLocaleDateString(),
    },
  ];

  const actions = (bill) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleViewDetails(bill)}
        className="text-blue-600 hover:text-blue-900"
        title="View details"
      >
        <Eye size={16} />
      </button>
      {['admin', 'receptionist'].includes(user?.role) && (
        <>
          <button
            onClick={() => handleEditBill(bill)}
            className="text-green-600 hover:text-green-900"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteBill(bill)}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
        {['admin', 'receptionist'].includes(user?.role) && (
          <button onClick={handleAddBill} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Create Bill
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {['admin', 'receptionist'].includes(user?.role) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue?.toFixed(0) || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Total Paid</p>
            <p className="text-2xl font-bold text-blue-600">₹{stats.totalPaid?.toFixed(0) || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Total Pending</p>
            <p className="text-2xl font-bold text-yellow-600">₹{stats.totalPending?.toFixed(0) || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Overdue Bills</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdueCount || 0}</p>
          </div>
        </div>
      )}

      {/* Alerts */}
      {successMessage && <Alert type="success" message={successMessage} />}
      {errorMessage && <Alert type="error" message={errorMessage} />}
      {error && <Alert type="error" message={error} />}

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by bill ID or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {['admin', 'receptionist'].includes(user?.role) && (
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Bills Table */}
      <div className="card">
        <Table columns={columns} data={bills} actions={actions} loading={loading} />
      </div>

      {/* Pagination */}
      {bills.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {bills.length} of {pagination.total} bills
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

      {/* Form Modal */}
      <BillFormModal
        isOpen={showFormModal}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        bill={selectedBill}
      />

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={handleDetailClose} title={selectedBill?.billId}>
        {selectedBill && (
          <BillDetailView
            bill={selectedBill}
            onEdit={() => {
              handleDetailClose();
              handleEditBill(selectedBill);
            }}
            onDelete={() => {
              handleDetailClose();
              handleDeleteBill(selectedBill);
            }}
            isStaff={['admin', 'receptionist'].includes(user?.role)}
          />
        )}
      </Modal>
    </div>
  );
}

// Import Eye icon (add if not present)
import { Eye } from 'lucide-react';
