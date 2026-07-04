'use strict';

const { body } = require('express-validator');

const doctorValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2–50 characters.'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2–50 characters.'),

  body('specialization')
    .trim()
    .notEmpty().withMessage('Specialization is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Specialization must be 2–100 characters.'),

  body('qualification')
    .optional()
    .trim(),

  body('experience')
    .optional()
    .isInt({ min: 0 }).withMessage('Experience must be a non-negative integer.'),

  body('consultationFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Consultation fee must be a non-negative number.'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Please provide a valid phone number.'),

  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('availability')
    .optional()
    .trim(),
];

module.exports = {
  doctorValidation,
};
