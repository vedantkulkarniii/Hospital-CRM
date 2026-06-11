'use strict';

const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Get dashboard statistics
 * Aggregates data: total patients, total doctors, appointments today, etc.
 * @route GET /api/dashboard/stats
 * @access Private
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Count total users by role
    const stats = {
      totalPatients: await User.countDocuments({ role: 'patient', isActive: true }),
      totalDoctors: await User.countDocuments({ role: 'doctor', isActive: true }),
      totalReceptionists: await User.countDocuments({ role: 'receptionist', isActive: true }),
      totalAdmins: await User.countDocuments({ role: 'admin', isActive: true }),
      appointmentsToday: 0, // Will be populated when Appointment model is created
      appointmentsThisMonth: 0, // Will be populated when Appointment model is created
      revenueThisMonth: 0, // Will be populated when Billing model is created
    };

    // Role-based filtering
    const roleBasedStats = {
      admin: stats,
      doctor: {
        myAppointmentsToday: 0, // Will be populated when Appointment model is created
        myPatientsCount: 0, // Will be populated when patient-doctor relationship is created
        appointmentsThisMonth: 0,
      },
      receptionist: {
        appointmentsToday: stats.appointmentsToday,
        newPatientsThisMonth: 0,
        pendingBills: 0,
      },
      patient: {
        myAppointments: 0,
        myPrescriptions: 0,
        pendingPayments: 0,
      },
    };

    const responseStats = roleBasedStats[userRole] || stats;

    return sendSuccess(res, responseStats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
