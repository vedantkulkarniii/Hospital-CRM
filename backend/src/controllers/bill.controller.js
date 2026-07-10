'use strict';

const billService = require('../services/bill.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new bill.
 * @route POST /api/bills
 */
const createBill = async (req, res, next) => {
  try {
    const billData = req.body;
    const userId = req.user._id || req.user.id;

    const bill = await billService.createBill(billData, userId);

    return sendSuccess(res, 201, 'Bill created successfully.', bill);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve bills (paginated, sorted, filtered).
 * @route GET /api/bills
 */
const getBills = async (req, res, next) => {
  try {
    const { page, limit, search, patient, status, sort } = req.query;

    const { bills, total, page: currentPage, limit: currentLimit } = await billService.getBills({
      page,
      limit,
      search,
      patient,
      status,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Bills retrieved successfully.', bills, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single bill by ID.
 * @route GET /api/bills/:id
 */
const getBillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bill = await billService.getBillById(id);

    return sendSuccess(res, 200, 'Bill details retrieved successfully.', bill);
  } catch (error) {
    next(error);
  }
};

/**
 * Update bill details.
 * @route PUT /api/bills/:id
 */
const updateBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const bill = await billService.updateBill(id, updateData);

    return sendSuccess(res, 200, 'Bill updated successfully.', bill);
  } catch (error) {
    next(error);
  }
};

/**
 * Update bill payment status.
 * @route PUT /api/bills/:id/payment
 */
const updateBillPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod = 'cash', transactionId = '' } = req.body;

    const bill = await billService.updateBillPaymentStatus(id, paidAmount, paymentMethod, transactionId);

    return sendSuccess(res, 200, 'Bill payment updated successfully.', bill);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a bill.
 * @route DELETE /api/bills/:id
 */
const deleteBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bill = await billService.deleteBill(id);

    return sendSuccess(res, 200, 'Bill deleted successfully.', bill);
  } catch (error) {
    next(error);
  }
};

/**
 * Get bills by patient.
 * @route GET /api/bills/patient/:patientId
 */
const getBillsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { bills, total, page: currentPage, limit: currentLimit } = await billService.getBillsByPatient(
      patientId,
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Patient bills retrieved successfully.', bills, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get bills by status.
 * @route GET /api/bills/status/:status
 */
const getBillsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { bills, total, page: currentPage, limit: currentLimit } = await billService.getBillsByStatus(
      status,
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, `Bills with status '${status}' retrieved successfully.`, bills, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get billing statistics/dashboard.
 * @route GET /api/bills/stats/dashboard
 */
const getBillingStats = async (req, res, next) => {
  try {
    const stats = await billService.getBillingStats();

    return sendSuccess(res, 200, 'Billing statistics retrieved successfully.', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBill,
  getBills,
  getBillById,
  updateBill,
  updateBillPayment,
  deleteBill,
  getBillsByPatient,
  getBillsByStatus,
  getBillingStats,
};
