'use strict';

const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Prescription = require('../models/Prescription');

/**
 * Analytics Service — all analytics and reporting business logic.
 */

/**
 * Get patient demographics analytics (T-153).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getPatientDemographics = async ({ startDate, endDate } = {}) => {
  const query = { isDeleted: false };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {query.createdAt.$gte = new Date(startDate);}
    if (endDate) {query.createdAt.$lte = new Date(endDate);}
  }

  const [totalPatients, byGender, byAgeGroup, newPatients] = await Promise.all([
    Patient.countDocuments(query),
    Patient.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
        },
      },
    ]),
    Patient.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 35, 50, 65, 100],
          default: 'Unknown',
          output: { count: { $sum: 1 } },
        },
      },
    ]),
    Patient.countDocuments({
      ...query,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  return {
    totalPatients,
    newPatients,
    byGender,
    byAgeGroup,
  };
};

/**
 * Get doctor performance analytics (T-154).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getDoctorPerformance = async ({ startDate, endDate } = {}) => {
  const query = { isDeleted: false };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {query.createdAt.$gte = new Date(startDate);}
    if (endDate) {query.createdAt.$lte = new Date(endDate);}
  }

  const appointmentQuery = { ...query };
  if (startDate || endDate) {
    appointmentQuery.appointmentDate = {};
    if (startDate) {appointmentQuery.appointmentDate.$gte = new Date(startDate);}
    if (endDate) {appointmentQuery.appointmentDate.$lte = new Date(endDate);}
  }

  const [totalDoctors, appointmentsByDoctor, completedAppointments, averageRating] = await Promise.all([
    Doctor.countDocuments(query),
    Appointment.aggregate([
      { $match: appointmentQuery },
      {
        $group: {
          _id: '$doctor',
          appointmentCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
      {
        $unwind: '$doctorInfo',
      },
      {
        $project: {
          doctorId: '$_id',
          doctorName: {
            $concat: ['$doctorInfo.firstName', ' ', '$doctorInfo.lastName'],
          },
          appointmentCount: 1,
          completedCount: 1,
        },
      },
    ]),
    Appointment.countDocuments({
      ...appointmentQuery,
      status: 'completed',
    }),
    Doctor.aggregate([
      { $match: query },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]),
  ]);

  return {
    totalDoctors,
    appointmentsByDoctor,
    completedAppointments,
    averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
  };
};

/**
 * Get appointment analytics (T-155).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getAppointmentAnalytics = async ({ startDate, endDate } = {}) => {
  const query = {};

  if (startDate || endDate) {
    query.appointmentDate = {};
    if (startDate) {query.appointmentDate.$gte = new Date(startDate);}
    if (endDate) {query.appointmentDate.$lte = new Date(endDate);}
  }

  const [
    totalAppointments,
    byStatus,
    byType,
    completionRate,
    cancellationRate,
  ] = await Promise.all([
    Appointment.countDocuments(query),
    Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]),
    Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          completionRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
            ],
          },
        },
      },
    ]),
    Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          cancellationRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$cancelled', '$total'] }, 100] },
            ],
          },
        },
      },
    ]),
  ]);

  return {
    totalAppointments,
    byStatus,
    byType,
    completionRate: completionRate.length > 0 ? completionRate[0].completionRate : 0,
    cancellationRate: cancellationRate.length > 0 ? cancellationRate[0].cancellationRate : 0,
  };
};

/**
 * Get billing revenue analytics (T-156).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getBillingRevenue = async ({ startDate, endDate } = {}) => {
  const query = { isDeleted: false };

  if (startDate || endDate) {
    query.issuedDate = {};
    if (startDate) {query.issuedDate.$gte = new Date(startDate);}
    if (endDate) {query.issuedDate.$lte = new Date(endDate);}
  }

  const [
    totalRevenue,
    byStatus,
    collectionRate,
    monthlyRevenue,
  ] = await Promise.all([
    Bill.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalPending: { $sum: '$pendingAmount' },
        },
      },
    ]),
    Bill.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$totalAmount' },
        },
      },
    ]),
    Bill.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          collected: { $sum: '$paidAmount' },
        },
      },
      {
        $project: {
          collectionRate: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$collected', '$total'] }, 100] },
            ],
          },
        },
      },
    ]),
    Bill.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$issuedDate' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0] : { totalAmount: 0, totalPaid: 0, totalPending: 0 },
    byStatus,
    collectionRate: collectionRate.length > 0 ? collectionRate[0].collectionRate : 0,
    monthlyRevenue,
  };
};

/**
 * Get prescription trends (T-157).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getPrescriptionTrends = async ({ startDate, endDate } = {}) => {
  const query = { isDeleted: false };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {query.createdAt.$gte = new Date(startDate);}
    if (endDate) {query.createdAt.$lte = new Date(endDate);}
  }

  const [
    totalPrescriptions,
    byDoctor,
    topMedications,
    activePrescriptions,
  ] = await Promise.all([
    Prescription.countDocuments(query),
    Prescription.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$doctor',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
    ]),
    Prescription.aggregate([
      { $match: query },
      { $unwind: '$medications' },
      {
        $group: {
          _id: '$medications.name',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Prescription.countDocuments({
      ...query,
      isActive: true,
    }),
  ]);

  return {
    totalPrescriptions,
    byDoctor,
    topMedications,
    activePrescriptions,
  };
};

/**
 * Get system-wide financial summary (T-158).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getFinancialSummary = async ({ startDate, endDate } = {}) => {
  const queryDate = {};
  if (startDate || endDate) {
    if (startDate) {queryDate.$gte = new Date(startDate);}
    if (endDate) {queryDate.$lte = new Date(endDate);}
  }

  const billQuery = queryDate ? { issuedDate: queryDate } : {};

  const [billStats, appointmentStats] = await Promise.all([
    Bill.aggregate([
      { $match: billQuery },
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalPending: { $sum: '$pendingAmount' },
          avgBillAmount: { $avg: '$totalAmount' },
          billCount: { $sum: 1 },
        },
      },
    ]),
    Appointment.aggregate([
      { $match: queryDate ? { appointmentDate: queryDate } : {} },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          avgConsultationFee: {
            $avg: { $ifNull: ['$consultationFee', 0] },
          },
        },
      },
    ]),
  ]);

  const billingData = billStats.length > 0 ? billStats[0] : {};
  const appointmentData = appointmentStats.length > 0 ? appointmentStats[0] : {};

  return {
    billing: {
      totalBilled: billingData.totalBilled || 0,
      totalPaid: billingData.totalPaid || 0,
      totalPending: billingData.totalPending || 0,
      avgBillAmount: billingData.avgBillAmount || 0,
      billCount: billingData.billCount || 0,
    },
    appointments: {
      totalAppointments: appointmentData.totalAppointments || 0,
      avgConsultationFee: appointmentData.avgConsultationFee || 0,
    },
  };
};

/**
 * Get occupancy/utilization rate (T-159).
 * @param {object} options - { startDate, endDate }
 * @returns {Promise<object>}
 */
const getOccupancyRate = async ({ startDate, endDate } = {}) => {
  const query = {};

  if (startDate || endDate) {
    query.appointmentDate = {};
    if (startDate) {query.appointmentDate.$gte = new Date(startDate);}
    if (endDate) {query.appointmentDate.$lte = new Date(endDate);}
  }

  const [doctorSlots, appointmentsByDoctor] = await Promise.all([
    Doctor.aggregate([
      {
        $group: {
          _id: null,
          totalDoctors: { $sum: 1 },
        },
      },
    ]),
    Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$doctor',
          appointmentCount: { $sum: 1 },
        },
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const totalDoctors = doctorSlots.length > 0 ? doctorSlots[0].totalDoctors : 0;
  const activeDoctors = appointmentsByDoctor.length;
  const occupancyRate = totalDoctors > 0 ? (activeDoctors / totalDoctors) * 100 : 0;

  return {
    totalDoctors,
    activeDoctors,
    occupancyRate,
    topDoctorsByAppointments: appointmentsByDoctor,
  };
};

module.exports = {
  getPatientDemographics,
  getDoctorPerformance,
  getAppointmentAnalytics,
  getBillingRevenue,
  getPrescriptionTrends,
  getFinancialSummary,
  getOccupancyRate,
};
