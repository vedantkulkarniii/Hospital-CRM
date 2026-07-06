'use strict';

const express = require('express');

const patientController = require('../controllers/patient.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { patientValidation } = require('../middleware/validators/patient.validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes for patients
router.post(
  '/',
  authorize('admin', 'doctor', 'receptionist'),
  patientValidation,
  validate,
  patientController.createPatient,
);

router.get(
  '/',
  authorize('admin', 'doctor', 'receptionist'),
  patientController.getPatients,
);

router.get(
  '/:id',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  patientController.getPatientById,
);

router.put(
  '/:id',
  authorize('admin', 'doctor', 'receptionist'),
  patientValidation,
  validate,
  patientController.updatePatient,
);

router.delete(
  '/:id',
  authorize('admin'),
  patientController.deletePatient,
);

module.exports = router;
