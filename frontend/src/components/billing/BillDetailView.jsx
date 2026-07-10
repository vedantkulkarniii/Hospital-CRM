import { User, Stethoscope, FileText, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';
import billService from '../../services/billService.js';

export default function BillDetailView({ bill, onEdit, onDelete, isStaff }) {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paidAmount: 0,
    paymentMethod: 'cash',
    transactionId: '',
  });

  if (!bill) return null;

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

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingPayment(true);
      await billService.updateBillPayment(bill._id, paymentData);
      setShowPaymentForm(false);
      setPaymentData({ paidAmount: 0, paymentMethod: 'cash', transactionId: '' });
      // Refresh bill details
      window.location.reload();
    } catch (error) {
      alert('Failed to update payment: ' + error.response?.data?.message);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{bill.billId}</h2>
          <p className="text-gray-600 mt-1">
            {new Date(bill.issuedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(bill.status)}`}>
          {bill.status?.charAt(0).toUpperCase() + bill.status?.slice(1)}
        </span>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Patient</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {bill.patient?.firstName} {bill.patient?.lastName}
            </p>
            <p className="text-sm text-gray-600">{bill.patient?.patientId}</p>
            {bill.patient?.email && (
              <p className="text-sm text-gray-600">{bill.patient.email}</p>
            )}
          </div>
        </div>

        {/* Appointment Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={20} className="text-green-600" />
            <h3 className="font-bold text-gray-900">Appointment</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">{bill.appointment?.appointmentId}</p>
            <p className="text-sm text-gray-600">
              {new Date(bill.appointment?.appointmentDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Bill Amount Breakdown */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-purple-600" />
          <h3 className="font-bold text-gray-900">Amount Breakdown</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Consultation Fee:</span>
            <span className="font-medium">₹{bill.consultationFee?.toFixed(2)}</span>
          </div>
          {bill.medicationCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Medication Cost:</span>
              <span className="font-medium">₹{bill.medicationCost?.toFixed(2)}</span>
            </div>
          )}
          {bill.labTestCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Lab Test Cost:</span>
              <span className="font-medium">₹{bill.labTestCost?.toFixed(2)}</span>
            </div>
          )}
          {bill.otherCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Other Charges:</span>
              <span className="font-medium">₹{bill.otherCharges?.toFixed(2)}</span>
            </div>
          )}
          {bill.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span className="font-medium">-₹{bill.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{bill.subtotal?.toFixed(2)}</span>
          </div>
          {bill.taxPercentage > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({bill.taxPercentage}%):</span>
              <span className="font-medium">₹{bill.taxAmount?.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between bg-gray-50 p-2 rounded font-bold">
            <span>Total Amount:</span>
            <span className="text-lg">₹{bill.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Payment Status</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Total Paid</p>
            <p className="text-xl font-bold text-blue-600">₹{bill.paidAmount?.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Pending</p>
            <p className="text-xl font-bold text-yellow-600">₹{bill.pendingAmount?.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase">Payment Method</p>
            <p className="text-lg font-bold text-gray-900 capitalize">{bill.paymentMethod}</p>
          </div>
        </div>

        {bill.transactionId && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Transaction ID:</span> {bill.transactionId}
          </div>
        )}

        {bill.paymentDate && (
          <div className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Payment Date:</span>{' '}
            {new Date(bill.paymentDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Due Date */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-orange-600" />
          <h3 className="font-bold text-gray-900">Due Date</h3>
        </div>
        <p className="text-lg text-gray-900">
          {new Date(bill.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {bill.isOverdue && (
          <p className="text-red-600 mt-2 font-medium">
            ⚠️ Overdue by {bill.daysOverdue} day{bill.daysOverdue !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Description & Notes */}
      {bill.description && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-900">{bill.description}</p>
        </div>
      )}

      {bill.notes && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-900">{bill.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {bill.status !== 'paid' && (
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="btn-primary"
          >
            {showPaymentForm ? 'Cancel Payment' : 'Record Payment'}
          </button>
        )}

        {isStaff && (
          <>
            <button onClick={onEdit} className="btn-secondary">
              Edit Bill
            </button>
            <button onClick={onDelete} className="btn-secondary text-red-600 hover:bg-red-50">
              Delete Bill
            </button>
          </>
        )}
      </div>

      {/* Payment Form */}
      {showPaymentForm && (
        <form onSubmit={handlePaymentSubmit} className="card space-y-4 bg-blue-50">
          <h3 className="font-bold text-gray-900">Record Payment</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (₹) *</label>
            <input
              type="number"
              value={paymentData.paidAmount}
              onChange={(e) =>
                setPaymentData({ ...paymentData, paidAmount: parseFloat(e.target.value) || 0 })
              }
              min="0"
              step="0.01"
              max={bill.pendingAmount}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-600 mt-1">Max: ₹{bill.pendingAmount?.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              value={paymentData.transactionId}
              onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={isUpdatingPayment} className="btn-primary">
              {isUpdatingPayment ? 'Saving...' : 'Save Payment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
