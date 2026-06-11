'use strict';

const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics based on user role
 */
router.get('/stats', dashboardController.getStats);

module.exports = router;
