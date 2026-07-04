'use strict';

const express = require('express');

const doctorController = require('../controllers/doctor.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { doctorValidation } = require('../middleware/validators/doctor.validators');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('admin', 'receptionist'),
  doctorValidation,
  validate,
  doctorController.createDoctor,
);

router.get(
  '/',
  authorize('admin', 'doctor', 'receptionist'),
  doctorController.getDoctors,
);

router.get(
  '/:id',
  authorize('admin', 'doctor', 'receptionist'),
  doctorController.getDoctorById,
);

router.put(
  '/:id',
  authorize('admin', 'receptionist'),
  doctorValidation,
  validate,
  doctorController.updateDoctor,
);

router.delete(
  '/:id',
  authorize('admin'),
  doctorController.deleteDoctor,
);

module.exports = router;
