'use strict';

const express = require('express');

const billController = require('../controllers/bill.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const billValidators = require('../middleware/validators/bill.validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get billing stats/dashboard (must come before :id route)
router.get(
  '/stats/dashboard',
  authorize('admin', 'receptionist'),
  billController.getBillingStats,
);

// CRUD routes for bills
router.post(
  '/',
  authorize('admin', 'receptionist'),
  billValidators.createBill,
  validate,
  billController.createBill,
);

router.get(
  '/',
  authorize('admin', 'receptionist', 'patient'),
  billController.getBills,
);

router.get(
  '/patient/:patientId',
  authorize('admin', 'receptionist', 'patient'),
  billValidators.validatePatientId,
  validate,
  billController.getBillsByPatient,
);

router.get(
  '/status/:status',
  authorize('admin', 'receptionist'),
  billValidators.validateStatus,
  validate,
  billController.getBillsByStatus,
);

router.get(
  '/:id',
  authorize('admin', 'receptionist', 'patient'),
  billValidators.validateBillId,
  validate,
  billController.getBillById,
);

router.put(
  '/:id',
  authorize('admin', 'receptionist'),
  billValidators.validateBillId,
  billValidators.updateBill,
  validate,
  billController.updateBill,
);

router.put(
  '/:id/payment',
  authorize('admin', 'receptionist', 'patient'),
  billValidators.validateBillId,
  billValidators.updatePayment,
  validate,
  billController.updateBillPayment,
);

router.delete(
  '/:id',
  authorize('admin', 'receptionist'),
  billValidators.validateBillId,
  validate,
  billController.deleteBill,
);

module.exports = router;
