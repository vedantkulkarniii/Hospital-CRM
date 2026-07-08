'use strict';

const express = require('express');

const appointmentController = require('../controllers/appointment.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  appointmentValidation,
  updateAppointmentValidation,
  cancelAppointmentValidation,
} = require('../middleware/validators/appointment.validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD routes for appointments
router.post(
  '/',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  appointmentValidation,
  validate,
  appointmentController.createAppointment,
);

router.get(
  '/',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  appointmentController.getAppointments,
);

router.get(
  '/today',
  authorize('admin', 'doctor', 'receptionist'),
  appointmentController.getTodayAppointments,
);

router.get(
  '/range',
  authorize('admin', 'doctor', 'receptionist'),
  appointmentController.getAppointmentsByDateRange,
);

router.get(
  '/:id',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  appointmentController.getAppointmentById,
);

router.put(
  '/:id',
  authorize('admin', 'doctor', 'receptionist'),
  updateAppointmentValidation,
  validate,
  appointmentController.updateAppointment,
);

router.patch(
  '/:id/cancel',
  authorize('admin', 'doctor', 'receptionist', 'patient'),
  cancelAppointmentValidation,
  validate,
  appointmentController.cancelAppointment,
);

router.delete(
  '/:id',
  authorize('admin'),
  appointmentController.deleteAppointment,
);

module.exports = router;
