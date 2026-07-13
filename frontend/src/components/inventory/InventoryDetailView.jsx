import { useState } from 'react';
import { Edit2, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import inventoryService from '../../services/inventoryService.js';

export default function InventoryDetailView({ item, onEdit, onDelete }) {
  const [showQuantityUpdate, setShowQuantityUpdate] = useState(false);
  const [quantityChange, setQuantityChange] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isExpired = item.expiryDate && new Date() > new Date(item.expiryDate);
  const isExpiring =
    item.expiryDate &&
    !isExpired &&
    new Date(item.expiryDate) - new Date() < 30 * 24 * 60 * 60 * 1000;
  const isLowStock = item.quantity <= item.minThreshold;
  const isOutOfStock = item.quantity === 0;

  const handleQuantityUpdate = async (e) => {
    e.preventDefault();
    if (quantityChange === 0) {
      setError('Quantity change cannot be zero');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const newQuantity = item.quantity + quantityChange;
      await inventoryService.updateInventoryItem(item._id, {
        quantity: newQuantity,
      });

      setSuccess(
        `Quantity updated: ${item.quantity} → ${newQuantity} (${quantityChange > 0 ? '+' : ''}${quantityChange})`,
      );
      setQuantityChange(0);
      setShowQuantityUpdate(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStockStatus = () => {
    if (isOutOfStock) {
      return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Out of Stock' };
    }
    if (isLowStock) {
      return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Low Stock' };
    }
    return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'In Stock' };
  };

  const status = getStockStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">{success}</div>}

      {/* Header with Status */}
      <div className={`p-4 rounded-lg ${status.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className={status.color} size={24} />
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Status</p>
              <p className={`text-lg font-bold ${status.color}`}>{status.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {item.quantity}
              <span className="text-lg text-gray-600 ml-1">{item.unit}</span>
            </p>
            <p className="text-sm text-gray-600">
              Threshold: {item.minThreshold} - {item.maxThreshold}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {isExpired && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>This item has expired on {formatDate(item.expiryDate)}</span>
          </div>
        )}
        {isExpiring && !isExpired && (
          <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg flex items-center gap-2 text-sm">
            <Clock size={16} />
            <span>This item expires on {formatDate(item.expiryDate)}</span>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Item Code</p>
          <p className="text-lg font-semibold text-gray-900">{item.itemCode}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Category</p>
          <p className="text-lg font-semibold text-gray-900">
            {item.category?.replace(/_/g, ' ').toUpperCase()}
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Cost Price</p>
          <p className="text-lg font-semibold text-gray-900">₹{item.costPrice?.toFixed(2)}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Selling Price</p>
          <p className="text-lg font-semibold text-gray-900">₹{item.sellingPrice?.toFixed(2)}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Stock Value</p>
          <p className="text-lg font-semibold text-gray-900">
            ₹{(item.quantity * item.costPrice)?.toFixed(0)}
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Total Consumed</p>
          <p className="text-lg font-semibold text-gray-900">{item.totalConsumed || 0}</p>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase mb-2">Description</p>
          <p className="text-gray-700">{item.description}</p>
        </div>
      )}

      {/* Supplier Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Supplier</p>
          <p className="text-gray-900">{item.supplier || 'N/A'}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Contact</p>
          <p className="text-gray-900">{item.supplierContact || 'N/A'}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Added Date</p>
          <p className="text-gray-900">{formatDate(item.dateAdded)}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Expiry Date</p>
          <p className={item.expiryDate ? 'text-gray-900' : 'text-gray-500'}>
            {formatDate(item.expiryDate)}
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Last Restock</p>
          <p className="text-gray-900">{formatDate(item.lastRestockDate)}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 uppercase">Last Consumed</p>
          <p className="text-gray-900">{formatDate(item.lastConsumedDate)}</p>
        </div>
      </div>

      {/* Quantity Update Section */}
      {!showQuantityUpdate ? (
        <button
          onClick={() => setShowQuantityUpdate(true)}
          className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
        >
          Update Quantity
        </button>
      ) : (
        <form onSubmit={handleQuantityUpdate} className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Adjust Quantity</p>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Current: {item.quantity}</p>
                <input
                  type="number"
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(parseInt(e.target.value) || 0)}
                  placeholder="Enter change (+/-)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">New: {item.quantity + quantityChange}</p>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
                  {item.quantity + quantityChange}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowQuantityUpdate(false);
                  setQuantityChange(0);
                  setError('');
                }}
                className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || quantityChange === 0}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end border-t pt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
