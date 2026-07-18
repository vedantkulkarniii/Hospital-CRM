'use strict';

const express = require('express');

const analyticsController = require('../controllers/analytics.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Analytics endpoints — admin and receptionist only (can view reports)
router.get(
  '/dashboard',
  authorize('admin', 'receptionist'),
  analyticsController.getDashboardAnalytics,
);

router.get(
  '/patients',
  authorize('admin', 'receptionist'),
  analyticsController.getPatientDemographics,
);

router.get(
  '/doctors',
  authorize('admin', 'receptionist'),
  analyticsController.getDoctorPerformance,
);

router.get(
  '/appointments',
  authorize('admin', 'receptionist'),
  analyticsController.getAppointmentAnalytics,
);

router.get(
  '/billing',
  authorize('admin', 'receptionist'),
  analyticsController.getBillingRevenue,
);

router.get(
  '/prescriptions',
  authorize('admin', 'receptionist'),
  analyticsController.getPrescriptionTrends,
);

router.get(
  '/financial-summary',
  authorize('admin', 'receptionist'),
  analyticsController.getFinancialSummary,
);

router.get(
  '/occupancy',
  authorize('admin', 'receptionist'),
  analyticsController.getOccupancyRate,
);

module.exports = router;
