'use strict';

const { body } = require('express-validator');

const patientValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2–50 characters.'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2–50 characters.'),

  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required.')
    .isISO8601().withMessage('Please provide a valid ISO 8601 date of birth (YYYY-MM-DD).'),

  body('gender')
    .notEmpty().withMessage('Gender is required.')
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Gender must be one of: male, female, other, prefer_not_to_say.'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Please provide a valid phone number.'),

  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'])
    .withMessage('Invalid blood group.'),

  body('allergies')
    .optional()
    .isArray().withMessage('Allergies must be an array of strings.'),

  body('address')
    .optional()
    .isObject().withMessage('Address must be an object.'),
  body('address.street')
    .optional()
    .trim(),
  body('address.city')
    .optional()
    .trim(),
  body('address.state')
    .optional()
    .trim(),
  body('address.postalCode')
    .optional()
    .trim(),
  body('address.country')
    .optional()
    .trim(),

  body('emergencyContact')
    .optional()
    .isObject().withMessage('Emergency contact must be an object.'),
  body('emergencyContact.name')
    .optional()
    .trim(),
  body('emergencyContact.relationship')
    .optional()
    .trim(),
  body('emergencyContact.phone')
    .optional()
    .trim(),

  body('medicalHistory')
    .optional()
    .isArray().withMessage('Medical history must be an array of objects.'),
  body('medicalHistory.*.condition')
    .notEmpty().withMessage('Condition is required for medical history entries.')
    .trim(),
  body('medicalHistory.*.diagnosedAt')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('diagnosedAt must be a valid date.'),
  body('medicalHistory.*.notes')
    .optional()
    .trim(),
  body('medicalHistory.*.isOngoing')
    .optional()
    .isBoolean().withMessage('isOngoing must be a boolean.'),
];

module.exports = {
  patientValidation,
};
