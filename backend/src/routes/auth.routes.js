'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../middleware/validators/auth.validators');

const router = express.Router();

// Stricter rate limit for auth endpoints (brute force protection)
// DEVELOPMENT MODE: Disabled rate limiting for testing
// For production, uncomment the rate limiter below
const authLimiter = (req, res, next) => next();
/*
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});
*/

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register', authLimiter, registerValidation, validate, authController.register);
router.post('/login', authLimiter, loginValidation, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, validate, authController.resetPassword);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
