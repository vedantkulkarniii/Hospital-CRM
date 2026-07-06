'use strict';

const express = require('express');

const doctorController = require('../controllers/doctor.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { doctorValidation, updateDoctorValidation } = require('../middleware/validators/doctor.validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes for doctors
router.post(
  '/',
  authorize('admin'),
  doctorValidation,
  validate,
  doctorController.createDoctor,
);

router.get(
  '/',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  doctorController.getDoctors,
);

router.get(
  '/profile/me',
  authorize('doctor'),
  doctorController.getMyDoctorProfile,
);

router.get(
  '/specialization/:specialization',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  doctorController.getDoctorsBySpecialization,
);

router.get(
  '/:id',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  doctorController.getDoctorById,
);

router.put(
  '/:id',
  authorize('admin', 'doctor'),
  updateDoctorValidation,
  validate,
  doctorController.updateDoctor,
);

router.delete(
  '/:id',
  authorize('admin'),
  doctorController.deleteDoctor,
);

module.exports = router;
