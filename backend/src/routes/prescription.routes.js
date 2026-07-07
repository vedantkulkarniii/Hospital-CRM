'use strict';

const express = require('express');

const prescriptionController = require('../controllers/prescription.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Prescription validators
const prescriptionValidation = [
  body('appointment')
    .notEmpty().withMessage('Appointment ID is required.')
    .isMongoId().withMessage('Invalid Appointment ID format.'),
  body('patient')
    .notEmpty().withMessage('Patient ID is required.')
    .isMongoId().withMessage('Invalid Patient ID format.'),
  body('doctor')
    .notEmpty().withMessage('Doctor ID is required.')
    .isMongoId().withMessage('Invalid Doctor ID format.'),
  body('medications')
    .isArray({ min: 1 }).withMessage('At least one medication is required.'),
  body('medications.*.name')
    .trim().notEmpty().withMessage('Medication name is required.'),
  body('medications.*.dosage')
    .trim().notEmpty().withMessage('Dosage is required.'),
  body('medications.*.frequency')
    .trim().notEmpty().withMessage('Frequency is required.'),
  body('medications.*.duration')
    .trim().notEmpty().withMessage('Duration is required.'),
  body('diagnosis')
    .trim().notEmpty().withMessage('Diagnosis is required.')
    .isLength({ max: 500 }).withMessage('Diagnosis cannot exceed 500 characters.'),
];

// CRUD routes for prescriptions
router.post(
  '/',
  authorize('admin', 'doctor'),
  prescriptionValidation,
  validate,
  prescriptionController.createPrescription,
);

router.get(
  '/',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  prescriptionController.getPrescriptions,
);

router.get(
  '/patient/:patientId',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  prescriptionController.getPrescriptionsByPatient,
);

router.get(
  '/doctor/:doctorId',
  authorize('admin', 'doctor', 'receptionist'),
  prescriptionController.getPrescriptionsByDoctor,
);

router.get(
  '/:id',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  prescriptionController.getPrescriptionById,
);

router.put(
  '/:id',
  authorize('admin', 'doctor'),
  validate,
  prescriptionController.updatePrescription,
);

router.delete(
  '/:id',
  authorize('admin', 'doctor'),
  prescriptionController.deletePrescription,
);

module.exports = router;
