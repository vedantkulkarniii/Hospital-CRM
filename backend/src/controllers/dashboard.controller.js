'use strict';

const dashboardService = require('../services/dashboard.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Get dashboard statistics
 * Role-based stats with Redis caching
 * @route GET /api/dashboard/stats
 * @access Private
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats;

    // Get role-specific stats (with caching)
    switch (userRole) {
      case 'admin':
        stats = await dashboardService.getAdminStats(userId);
        break;
      case 'doctor':
        stats = await dashboardService.getDoctorStats(userId);
        break;
      case 'receptionist':
        stats = await dashboardService.getReceptionistStats(userId);
        break;
      case 'patient':
        stats = await dashboardService.getPatientStats(userId);
        break;
      default:
        stats = await dashboardService.getAdminStats(userId);
    }

    return sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
