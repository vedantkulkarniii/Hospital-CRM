'use strict';

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const { getCacheValue, setCacheValue, deleteCacheByPattern } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Get admin dashboard statistics
 * Aggregates and caches: total patients, doctors, appointments, revenue
 * @access Private (Admin)
 */
exports.getAdminStats = async (userId) => {
  const cacheKey = 'dashboard:admin:stats';

  try {
    // Check cache first
    let cachedStats = await getCacheValue(cacheKey);
    if (cachedStats) {
      logger.debug('Returning cached admin stats');
      return cachedStats;
    }

    // Fetch fresh data
    const [totalPatients, totalDoctors, totalReceptionists, totalAdmins, appointmentsToday, appointmentsThisMonth, revenueThisMonth] = await Promise.all([
      User.countDocuments({ role: 'patient', isActive: true }),
      User.countDocuments({ role: 'doctor', isActive: true }),
      User.countDocuments({ role: 'receptionist', isActive: true }),
      User.countDocuments({ role: 'admin', isActive: true }),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      }),
      Bill.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    const stats = {
      totalPatients,
      totalDoctors,
      totalReceptionists,
      totalAdmins,
      appointmentsToday,
      appointmentsThisMonth,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 5 minutes (300 seconds)
    await setCacheValue(cacheKey, stats, 300);

    return stats;
  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    throw error;
  }
};

/**
 * Get doctor dashboard statistics
 * @access Private (Doctor)
 */
exports.getDoctorStats = async (userId) => {
  const cacheKey = `dashboard:doctor:${userId}:stats`;

  try {
    let cachedStats = await getCacheValue(cacheKey);
    if (cachedStats) {
      logger.debug(`Returning cached doctor stats for user ${userId}`);
      return cachedStats;
    }

    // Find doctor by userId
    const doctor = await User.findById(userId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Fetch doctor-specific stats
    const [myAppointmentsToday, myAppointmentsThisMonth, myPatientsCount, myRevenueThisMonth] = await Promise.all([
      Appointment.countDocuments({
        doctor: doctor._id,
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Appointment.countDocuments({
        doctor: doctor._id,
        appointmentDate: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      }),
      Appointment.distinct('patient', {
        doctor: doctor._id,
      }).then((patients) => patients.length),
      Bill.aggregate([
        {
          $match: {
            doctor: doctor._id,
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
            paymentStatus: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    const stats = {
      myAppointmentsToday,
      myAppointmentsThisMonth,
      myPatientsCount,
      myRevenueThisMonth: myRevenueThisMonth[0]?.total || 0,
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await setCacheValue(cacheKey, stats, 300);

    return stats;
  } catch (error) {
    logger.error(`Error fetching doctor stats for ${userId}:`, error);
    throw error;
  }
};

/**
 * Get receptionist dashboard statistics
 * @access Private (Receptionist)
 */
exports.getReceptionistStats = async (userId) => {
  const cacheKey = `dashboard:receptionist:${userId}:stats`;

  try {
    let cachedStats = await getCacheValue(cacheKey);
    if (cachedStats) {
      logger.debug(`Returning cached receptionist stats for user ${userId}`);
      return cachedStats;
    }

    const [appointmentsToday, newPatientsThisMonth, pendingBills] = await Promise.all([
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Patient.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      }),
      Bill.countDocuments({ paymentStatus: 'pending' }),
    ]);

    const stats = {
      appointmentsToday,
      newPatientsThisMonth,
      pendingBills,
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await setCacheValue(cacheKey, stats, 300);

    return stats;
  } catch (error) {
    logger.error(`Error fetching receptionist stats for ${userId}:`, error);
    throw error;
  }
};

/**
 * Get patient dashboard statistics
 * @access Private (Patient)
 */
exports.getPatientStats = async (userId) => {
  const cacheKey = `dashboard:patient:${userId}:stats`;

  try {
    let cachedStats = await getCacheValue(cacheKey);
    if (cachedStats) {
      logger.debug(`Returning cached patient stats for user ${userId}`);
      return cachedStats;
    }

    // Find patient by userId
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      throw new Error('Patient not found');
    }

    const [myAppointments, myPrescriptions, pendingPayments] = await Promise.all([
      Appointment.countDocuments({ patient: patient._id }),
      Prescription.countDocuments({ patient: patient._id }),
      Bill.countDocuments({ patient: patient._id, paymentStatus: 'pending' }),
    ]);

    const stats = {
      myAppointments,
      myPrescriptions,
      pendingPayments,
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await setCacheValue(cacheKey, stats, 300);

    return stats;
  } catch (error) {
    logger.error(`Error fetching patient stats for ${userId}:`, error);
    throw error;
  }
};

/**
 * Invalidate dashboard cache when data changes
 * Called after creating/updating appointments, patients, bills, etc.
 */
exports.invalidateDashboardCache = async () => {
  try {
    const deletedCount = await deleteCacheByPattern('dashboard:*');
    logger.debug(`Invalidated ${deletedCount} dashboard cache entries`);
    return deletedCount;
  } catch (error) {
    logger.error('Error invalidating dashboard cache:', error);
  }
};
