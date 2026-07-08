'use strict';

const { body } = require('express-validator');

const appointmentValidation = [
  body('patient')
    .notEmpty().withMessage('Patient ID is required.')
    .isMongoId().withMessage('Invalid Patient ID format.'),

  body('doctor')
    .notEmpty().withMessage('Doctor ID is required.')
    .isMongoId().withMessage('Invalid Doctor ID format.'),

  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required.')
    .isISO8601().withMessage('Please provide a valid ISO 8601 appointment date.'),

  body('startTime')
    .trim()
    .notEmpty().withMessage('Start time is required.')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format.'),

  body('endTime')
    .trim()
    .notEmpty().withMessage('End time is required.')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format.'),

  body('type')
    .optional()
    .isIn(['consultation', 'follow-up', 'checkup', 'treatment', 'procedure', 'other'])
    .withMessage('Invalid appointment type.'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters.'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters.'),
];

const updateAppointmentValidation = [
  body('appointmentDate')
    .optional()
    .isISO8601().withMessage('Please provide a valid ISO 8601 appointment date.'),

  body('startTime')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format.'),

  body('endTime')
    .optional()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format.'),

  body('type')
    .optional()
    .isIn(['consultation', 'follow-up', 'checkup', 'treatment', 'procedure', 'other'])
    .withMessage('Invalid appointment type.'),

  body('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'])
    .withMessage('Invalid appointment status.'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters.'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters.'),

  body('nextFollowUpDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Please provide a valid ISO 8601 follow-up date.'),
];

const cancelAppointmentValidation = [
  body('cancellationReason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Cancellation reason cannot exceed 500 characters.'),
];

module.exports = {
  appointmentValidation,
  updateAppointmentValidation,
  cancelAppointmentValidation,
};
