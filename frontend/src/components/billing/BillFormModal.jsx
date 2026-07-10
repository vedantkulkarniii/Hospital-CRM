import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import billService from '../../services/billService.js';

export default function BillFormModal({ isOpen, onClose, onSuccess, bill }) {
  const [formData, setFormData] = useState({
    appointment: '',
    patient: '',
    consultationFee: 0,
    medicationCost: 0,
    labTestCost: 0,
    otherCharges: 0,
    discount: 0,
    taxPercentage: 0,
    description: '',
    dueDate: '',
    paymentMethod: 'pending',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (bill) {
      setFormData({
        appointment: bill.appointment?._id || '',
        patient: bill.patient?._id || '',
        consultationFee: bill.consultationFee || 0,
        medicationCost: bill.medicationCost || 0,
        labTestCost: bill.labTestCost || 0,
        otherCharges: bill.otherCharges || 0,
        discount: bill.discount || 0,
        taxPercentage: bill.taxPercentage || 0,
        description: bill.description || '',
        dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
        paymentMethod: bill.paymentMethod || 'pending',
        notes: bill.notes || '',
      });
    } else {
      setFormData({
        appointment: '',
        patient: '',
        consultationFee: 0,
        medicationCost: 0,
        labTestCost: 0,
        otherCharges: 0,
        discount: 0,
        taxPercentage: 0,
        description: '',
        dueDate: '',
        paymentMethod: 'pending',
        notes: '',
      });
    }
  }, [bill, isOpen]);

  // Calculate total amount
  useEffect(() => {
    const subtotal = formData.consultationFee + formData.medicationCost + formData.labTestCost + formData.otherCharges - formData.discount;
    const taxAmount = Math.max(0, subtotal) * (formData.taxPercentage / 100);
    setTotalAmount(Math.max(0, subtotal + taxAmount));
  }, [
    formData.consultationFee,
    formData.medicationCost,
    formData.labTestCost,
    formData.otherCharges,
    formData.discount,
    formData.taxPercentage,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Fee') || name.includes('Cost') || name.includes('Charges') || name.includes('discount') || name.includes('taxPercentage')
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        totalAmount,
      };

      if (bill) {
        await billService.updateBill(bill._id, submitData);
      } else {
        await billService.createBill(submitData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={bill ? 'Edit Bill' : 'Create New Bill'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}

        {/* Appointment & Patient */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment ID *</label>
            <input
              type="text"
              name="appointment"
              value={formData.appointment}
              onChange={handleChange}
              placeholder="Select appointment"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
            <input
              type="text"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              placeholder="Select patient"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Charges Section */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">Charges</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medication Cost (₹)</label>
              <input
                type="number"
                name="medicationCost"
                value={formData.medicationCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lab Test Cost (₹)</label>
              <input
                type="number"
                name="labTestCost"
                value={formData.labTestCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Charges (₹)</label>
              <input
                type="number"
                name="otherCharges"
                value={formData.otherCharges}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Discount & Tax */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax (%)</label>
            <input
              type="number"
              name="taxPercentage"
              value={formData.taxPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹)</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-bold text-gray-900">
              {totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Due Date & Payment Method */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>

        {/* Description & Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Bill description..."
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : bill ? 'Update Bill' : 'Create Bill'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
