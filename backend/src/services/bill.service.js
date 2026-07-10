'use strict';

const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const logger = require('../utils/logger');

/**
 * Bill Service — all billing business logic.
 */

/**
 * Create a new bill (T-129).
 * @param {object} billData - Bill details
 * @param {string} userId - ID of the user creating the bill
 * @returns {Promise<Bill>}
 */
const createBill = async (billData, userId) => {
  // Validate appointment exists
  const appointment = await Appointment.findById(billData.appointment);
  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  const bill = await Bill.create({
    ...billData,
    createdBy: userId,
  });

  // Populate references
  await bill.populate([
    { path: 'patient', select: 'firstName lastName patientId email' },
    { path: 'appointment', select: 'appointmentId appointmentDate' },
    { path: 'prescription', select: 'prescriptionId' },
    { path: 'createdBy', select: 'firstName lastName email' },
  ]);

  logger.info(`Bill created: ${bill.billId} for appointment: ${appointment.appointmentId}`);
  return bill;
};

/**
 * Get bills with pagination and filters (T-130).
 * @param {object} queryOptions - { page, limit, search, patient, status, sort }
 * @returns {Promise<{ bills, total, page, limit }>}
 */
const getBills = async ({
  page = 1,
  limit = 10,
  search = '',
  patient,
  status,
  sort = '-createdAt',
}) => {
  const query = {};

  // Apply filters
  if (patient) {
    query.patient = patient;
  }

  if (status) {
    query.status = status;
  }

  // Apply search (on bill ID, description)
  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { billId: { $regex: cleanSearch, $options: 'i' } },
      { description: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  const [bills, total] = await Promise.all([
    Bill.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('appointment', 'appointmentId appointmentDate')
      .populate('prescription', 'prescriptionId')
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
    Bill.countDocuments(query),
  ]);

  return {
    bills,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Get bill by ID (T-131).
 * @param {string} id - Bill MongoDB ID
 * @returns {Promise<Bill>}
 */
const getBillById = async (id) => {
  const bill = await Bill.findById(id)
    .populate('patient', 'firstName lastName email phone patientId')
    .populate('appointment', 'appointmentId appointmentDate startTime endTime reason')
    .populate('prescription', 'prescriptionId diagnosis medications')
    .populate('createdBy', 'firstName lastName email');

  if (!bill) {
    const error = new Error('Bill not found.');
    error.statusCode = 404;
    throw error;
  }

  return bill;
};

/**
 * Update bill status (T-132).
 * @param {string} id - Bill MongoDB ID
 * @param {object} updateData - Updated bill details
 * @returns {Promise<Bill>}
 */
const updateBill = async (id, updateData) => {
  const bill = await Bill.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('patient', 'firstName lastName patientId')
    .populate('appointment', 'appointmentId appointmentDate')
    .populate('prescription', 'prescriptionId')
    .populate('createdBy', 'firstName lastName');

  if (!bill) {
    const error = new Error('Bill not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Bill updated: ${bill.billId}`);
  return bill;
};

/**
 * Update bill payment status (T-132).
 * @param {string} id - Bill MongoDB ID
 * @param {number} paidAmount - Amount paid
 * @param {string} paymentMethod - Payment method
 * @param {string} transactionId - Transaction ID (optional)
 * @returns {Promise<Bill>}
 */
const updateBillPaymentStatus = async (id, paidAmount, paymentMethod = 'cash', transactionId = '') => {
  const bill = await Bill.findById(id);

  if (!bill) {
    const error = new Error('Bill not found.');
    error.statusCode = 404;
    throw error;
  }

  // Update paid amount and payment details
  bill.paidAmount = Math.min(bill.totalAmount, bill.paidAmount + paidAmount);
  bill.paymentMethod = paymentMethod;
  if (transactionId) {
    bill.transactionId = transactionId;
  }

  // Set payment date if fully paid
  if (bill.paidAmount >= bill.totalAmount) {
    bill.paymentDate = new Date();
    bill.status = 'paid';
  } else if (bill.paidAmount > 0) {
    bill.status = 'partial';
  }

  await bill.save();

  await bill.populate([
    { path: 'patient', select: 'firstName lastName patientId' },
    { path: 'appointment', select: 'appointmentId appointmentDate' },
    { path: 'createdBy', select: 'firstName lastName' },
  ]);

  logger.info(`Bill payment updated: ${bill.billId} - Amount: ₹${paidAmount}, Status: ${bill.status}`);
  return bill;
};

/**
 * Get bills by patient.
 * @param {string} patientId - Patient MongoDB ID
 * @param {object} options - { page, limit }
 * @returns {Promise<{ bills, total }>}
 */
const getBillsByPatient = async (patientId, { page = 1, limit = 10 } = {}) => {
  const query = { patient: patientId };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [bills, total] = await Promise.all([
    Bill.find(query)
      .populate('appointment', 'appointmentDate')
      .sort('-createdAt')
      .skip(skip)
      .limit(parsedLimit),
    Bill.countDocuments(query),
  ]);

  return { bills, total, page: parsedPage, limit: parsedLimit };
};

/**
 * Get bills by status.
 * @param {string} status - Bill status (pending, partial, paid, overdue, cancelled)
 * @param {object} options - { page, limit }
 * @returns {Promise<{ bills, total }>}
 */
const getBillsByStatus = async (status, { page = 1, limit = 10 } = {}) => {
  const query = { status };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [bills, total] = await Promise.all([
    Bill.find(query)
      .populate('patient', 'firstName lastName patientId')
      .sort('-createdAt')
      .skip(skip)
      .limit(parsedLimit),
    Bill.countDocuments(query),
  ]);

  return { bills, total, page: parsedPage, limit: parsedLimit };
};

/**
 * Soft delete a bill.
 * @param {string} id - Bill MongoDB ID
 * @returns {Promise<Bill>}
 */
const deleteBill = async (id) => {
  const bill = await Bill.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      status: 'cancelled',
    },
    { new: true },
  );

  if (!bill) {
    const error = new Error('Bill not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Bill soft deleted: ${bill.billId}`);
  return bill;
};

/**
 * Get billing summary/dashboard stats.
 * @returns {Promise<object>}
 */
const getBillingStats = async () => {
  const stats = await Bill.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $group: {
        _id: null,
        totalBills: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        totalPaid: { $sum: '$paidAmount' },
        totalPending: { $sum: '$pendingAmount' },
        paidCount: {
          $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] },
        },
        pendingCount: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        overdueCount: {
          $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
        },
        partialCount: {
          $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] },
        },
      },
    },
  ]);

  return stats.length > 0
    ? stats[0]
    : {
      totalBills: 0,
      totalRevenue: 0,
      totalPaid: 0,
      totalPending: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0,
      partialCount: 0,
    };
};

module.exports = {
  createBill,
  getBills,
  getBillById,
  updateBill,
  updateBillPaymentStatus,
  getBillsByPatient,
  getBillsByStatus,
  deleteBill,
  getBillingStats,
};
