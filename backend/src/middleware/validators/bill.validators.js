'use strict';

const { body, param } = require('express-validator');

/**
 * Bill Validators — reusable validation chains for bill operations.
 */

const billValidators = {
  /**
   * Validate bill creation
   */
  createBill: [
    body('appointment')
      .notEmpty().withMessage('Appointment ID is required.')
      .isMongoId().withMessage('Invalid Appointment ID format.'),
    body('patient')
      .notEmpty().withMessage('Patient ID is required.')
      .isMongoId().withMessage('Invalid Patient ID format.'),
    body('consultationFee')
      .notEmpty().withMessage('Consultation fee is required.')
      .isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number.'),
    body('totalAmount')
      .notEmpty().withMessage('Total amount is required.')
      .isFloat({ min: 0 }).withMessage('Total amount must be a positive number.'),
    body('dueDate')
      .notEmpty().withMessage('Due date is required.')
      .isISO8601().withMessage('Due date must be a valid date.'),
    body('medicationCost')
      .optional()
      .isFloat({ min: 0 }).withMessage('Medication cost must be a positive number.'),
    body('labTestCost')
      .optional()
      .isFloat({ min: 0 }).withMessage('Lab test cost must be a positive number.'),
    body('otherCharges')
      .optional()
      .isFloat({ min: 0 }).withMessage('Other charges must be a positive number.'),
    body('discount')
      .optional()
      .isFloat({ min: 0 }).withMessage('Discount must be a positive number.'),
    body('taxPercentage')
      .optional()
      .isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100.'),
    body('paymentMethod')
      .optional()
      .isIn(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'pending'])
      .withMessage('Invalid payment method.'),
  ],

  /**
   * Validate bill update
   */
  updateBill: [
    body('consultationFee')
      .optional()
      .isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number.'),
    body('medicationCost')
      .optional()
      .isFloat({ min: 0 }).withMessage('Medication cost must be a positive number.'),
    body('labTestCost')
      .optional()
      .isFloat({ min: 0 }).withMessage('Lab test cost must be a positive number.'),
    body('otherCharges')
      .optional()
      .isFloat({ min: 0 }).withMessage('Other charges must be a positive number.'),
    body('discount')
      .optional()
      .isFloat({ min: 0 }).withMessage('Discount must be a positive number.'),
    body('taxPercentage')
      .optional()
      .isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100.'),
    body('dueDate')
      .optional()
      .isISO8601().withMessage('Due date must be a valid date.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
  ],

  /**
   * Validate payment update
   */
  updatePayment: [
    body('paidAmount')
      .notEmpty().withMessage('Paid amount is required.')
      .isFloat({ min: 0 }).withMessage('Paid amount must be a positive number.'),
    body('paymentMethod')
      .notEmpty().withMessage('Payment method is required.')
      .isIn(['cash', 'card', 'upi', 'bank_transfer', 'cheque'])
      .withMessage('Invalid payment method.'),
    body('transactionId')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Transaction ID cannot exceed 100 characters.'),
  ],

  /**
   * Validate bill ID parameter
   */
  validateBillId: [
    param('id')
      .isMongoId().withMessage('Invalid bill ID format.'),
  ],

  /**
   * Validate patient ID parameter
   */
  validatePatientId: [
    param('patientId')
      .isMongoId().withMessage('Invalid patient ID format.'),
  ],

  /**
   * Validate status parameter
   */
  validateStatus: [
    param('status')
      .isIn(['pending', 'partial', 'paid', 'overdue', 'cancelled'])
      .withMessage('Invalid bill status.'),
  ],
};

module.exports = billValidators;
