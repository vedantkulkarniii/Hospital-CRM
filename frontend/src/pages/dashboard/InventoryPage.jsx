import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Trash2, Edit2, AlertTriangle, Package } from 'lucide-react';
import inventoryService from '../../services/inventoryService.js';
import {
  fetchItemsStart,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchAlertsStart,
  fetchAlertsSuccess,
  setFilters,
  setPagination,
  clearCurrentItem,
} from '../../store/slices/inventorySlice.js';
import Table from '../../components/common/Table.jsx';
import InventoryFormModal from '../../components/inventory/InventoryFormModal.jsx';
import InventoryDetailView from '../../components/inventory/InventoryDetailView.jsx';
import Modal from '../../components/common/Modal.jsx';
import Alert from '../../components/common/Alert.jsx';

const getStatusColor = (status) => {
  switch (status) {
    case 'in_stock':
      return 'bg-green-100 text-green-800';
    case 'low_stock':
      return 'bg-yellow-100 text-yellow-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    case 'discontinued':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function InventoryPage() {
  const dispatch = useDispatch();
  const { items, loading, error, pagination, filters, lowStockItems, outOfStockItems } = useSelector(
    (state) => state.inventory,
  );

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch items
  useEffect(() => {
    fetchItems();
  }, [pagination.page, pagination.limit, filters]);

  const fetchItems = async () => {
    try {
      dispatch(fetchItemsStart());
      const response = await inventoryService.getInventoryItems({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        category: filters.category,
        status: filters.status,
      });

      dispatch(
        fetchItemsSuccess({
          data: response.data,
          pagination: response.meta,
        }),
      );
    } catch (err) {
      dispatch(fetchItemsFailure(err.response?.data?.message || 'Failed to fetch inventory'));
      setErrorMessage(err.response?.data?.message || 'Failed to fetch inventory');
    }
  };

  // Fetch alerts
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      dispatch(fetchAlertsStart());
      const [lowStock, outOfStock, expiring, expired] = await Promise.all([
        inventoryService.getLowStockItems(),
        inventoryService.getOutOfStockItems(),
        inventoryService.getExpiringItems(),
        inventoryService.getExpiredItems(),
      ]);

      dispatch(
        fetchAlertsSuccess({
          lowStock: lowStock.data,
          outOfStock: outOfStock.data,
          expiring: expiring.data,
          expired: expired.data,
        }),
      );
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  };

  const handleSearch = (value) => {
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryFilter = (value) => {
    dispatch(setFilters({ category: value }));
  };

  const handleStatusFilter = (value) => {
    dispatch(setFilters({ status: value }));
  };

  const handleAddItem = () => {
    dispatch(clearCurrentItem());
    setSelectedItem(null);
    setShowFormModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowFormModal(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryService.deleteInventoryItem(item._id);
        setSuccessMessage('Item deleted successfully');
        fetchItems();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setSelectedItem(null);
  };

  const handleFormSuccess = () => {
    setSuccessMessage('Item saved successfully');
    handleFormClose();
    fetchItems();
    fetchAlerts();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  const columns = [
    { label: 'Item Code', key: 'itemCode' },
    { label: 'Name', key: 'itemName' },
    { label: 'Category', key: 'category' },
    {
      label: 'Quantity',
      key: 'quantity',
      render: (item) => (
        <span className={item.quantity === 0 ? 'font-bold text-red-600' : ''}>
          {item.quantity} {item.unit}
        </span>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      render: (item) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
          {item.status?.replace(/_/g, ' ').toUpperCase()}
        </span>
      ),
    },
    {
      label: 'Cost Price',
      key: 'costPrice',
      render: (item) => `₹${item.costPrice?.toFixed(2) || 0}`,
    },
    {
      label: 'Stock Value',
      key: 'totalValue',
      render: (item) => `₹${(item.quantity * item.costPrice)?.toFixed(0) || 0}`,
    },
  ];

  const actions = (item) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleViewDetails(item)}
        className="text-blue-600 hover:text-blue-900"
      >
        <Package size={16} />
      </button>
      <button
        onClick={() => handleEditItem(item)}
        className="text-green-600 hover:text-green-900"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={() => handleDeleteItem(item)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const totalAlerts = (lowStockItems?.length || 0) + (outOfStockItems?.length || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <button onClick={handleAddItem} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Alerts */}
      {successMessage && <Alert type="success" message={successMessage} />}
      {errorMessage && <Alert type="error" message={errorMessage} />}
      {error && <Alert type="error" message={error} />}

      {/* Alert Summary */}
      {totalAlerts > 0 && (
        <div className="card bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-yellow-900">Inventory Alerts</p>
              <p className="text-sm text-yellow-800">
                {outOfStockItems?.length || 0} out of stock, {lowStockItems?.length || 0} low stock items
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by code, name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.category}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="medication">Medication</option>
              <option value="medical_supplies">Medical Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="lab_materials">Lab Materials</option>
              <option value="consumables">Consumables</option>
              <option value="office_supplies">Office Supplies</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <Table columns={columns} data={items} actions={actions} loading={loading} />
      </div>

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {items.length} of {pagination.total} items
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
      <InventoryFormModal
        isOpen={showFormModal}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        item={selectedItem}
      />

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={handleDetailClose} title={selectedItem?.itemCode}>
        {selectedItem && (
          <InventoryDetailView
            item={selectedItem}
            onEdit={() => {
              handleDetailClose();
              handleEditItem(selectedItem);
            }}
            onDelete={() => {
              handleDetailClose();
              handleDeleteItem(selectedItem);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
