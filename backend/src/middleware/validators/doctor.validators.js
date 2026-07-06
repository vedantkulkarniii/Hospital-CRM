'use strict';

const { body } = require('express-validator');

const doctorValidation = [
  body('userId')
    .notEmpty().withMessage('User ID is required.')
    .isMongoId().withMessage('Invalid User ID format.'),

  body('specialization')
    .trim()
    .notEmpty().withMessage('Specialization is required.')
    .isIn([
      'General Practice',
      'Cardiology',
      'Dermatology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Psychiatry',
      'Surgery',
      'Ophthalmology',
      'ENT',
      'Gastroenterology',
      'Pulmonology',
      'Oncology',
      'Nephrology',
      'Rheumatology',
      'Urology',
      'Other',
    ])
    .withMessage(
      'Specialization must be one of: General Practice, Cardiology, Dermatology, Neurology, Orthopedics, Pediatrics, Psychiatry, Surgery, Ophthalmology, ENT, Gastroenterology, Pulmonology, Oncology, Nephrology, Rheumatology, Urology, Other.',
    ),

  body('qualifications')
    .notEmpty().withMessage('Qualifications are required.')
    .isArray({ min: 1 }).withMessage('At least one qualification must be provided.'),

  body('qualifications.*.degree')
    .trim()
    .notEmpty().withMessage('Degree is required for each qualification.')
    .isLength({ min: 2, max: 50 }).withMessage('Degree must be 2–50 characters.'),

  body('qualifications.*.institution')
    .optional()
    .trim(),

  body('qualifications.*.yearObtained')
    .notEmpty().withMessage('Year obtained is required for each qualification.')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year obtained must be between 1900 and current year.'),

  body('qualifications.*.certificateNumber')
    .optional()
    .trim(),

  body('yearsOfExperience')
    .notEmpty().withMessage('Years of experience is required.')
    .isInt({ min: 0, max: 80 }).withMessage('Years of experience must be between 0 and 80.'),

  body('licenseNumber')
    .trim()
    .notEmpty().withMessage('License number is required.')
    .isLength({ min: 5, max: 50 }).withMessage('License number must be 5–50 characters.'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Please provide a valid phone number.'),

  body('consultationFee')
    .notEmpty().withMessage('Consultation fee is required.')
    .isFloat({ min: 0 }).withMessage('Consultation fee must be a non-negative number.'),

  body('availability')
    .optional()
    .isArray().withMessage('Availability must be an array of time slots.'),

  body('availability.*.dayOfWeek')
    .trim()
    .notEmpty().withMessage('Day of week is required.')
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day of week.'),

  body('availability.*.startTime')
    .trim()
    .notEmpty().withMessage('Start time is required.')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format.'),

  body('availability.*.endTime')
    .trim()
    .notEmpty().withMessage('End time is required.')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format.'),

  body('availability.*.isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean.'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters.'),

  body('department')
    .optional()
    .trim(),

  body('officeAddress')
    .optional()
    .trim(),
];

const updateDoctorValidation = [
  body('specialization')
    .optional()
    .trim()
    .isIn([
      'General Practice',
      'Cardiology',
      'Dermatology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Psychiatry',
      'Surgery',
      'Ophthalmology',
      'ENT',
      'Gastroenterology',
      'Pulmonology',
      'Oncology',
      'Nephrology',
      'Rheumatology',
      'Urology',
      'Other',
    ])
    .withMessage('Invalid specialization.'),

  body('qualifications')
    .optional()
    .isArray({ min: 1 }).withMessage('At least one qualification must be provided.'),

  body('qualifications.*.degree')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Degree must be 2–50 characters.'),

  body('qualifications.*.yearObtained')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year obtained must be between 1900 and current year.'),

  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 80 }).withMessage('Years of experience must be between 0 and 80.'),

  body('licenseNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 }).withMessage('License number must be 5–50 characters.'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Please provide a valid phone number.'),

  body('consultationFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Consultation fee must be a non-negative number.'),

  body('availability')
    .optional()
    .isArray().withMessage('Availability must be an array of time slots.'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters.'),

  body('department')
    .optional()
    .trim(),

  body('officeAddress')
    .optional()
    .trim(),

  body('isVerified')
    .optional()
    .isBoolean().withMessage('isVerified must be a boolean.'),
];

module.exports = {
  doctorValidation,
  updateDoctorValidation,
};
