'use strict';

const analyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Get patient demographics analytics.
 * @route GET /api/analytics/patients
 */
const getPatientDemographics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getPatientDemographics({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Patient demographics retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor performance analytics.
 * @route GET /api/analytics/doctors
 */
const getDoctorPerformance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getDoctorPerformance({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Doctor performance analytics retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointment analytics.
 * @route GET /api/analytics/appointments
 */
const getAppointmentAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getAppointmentAnalytics({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Appointment analytics retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get billing revenue analytics.
 * @route GET /api/analytics/billing
 */
const getBillingRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getBillingRevenue({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Billing revenue analytics retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get prescription trends.
 * @route GET /api/analytics/prescriptions
 */
const getPrescriptionTrends = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getPrescriptionTrends({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Prescription trends retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get financial summary.
 * @route GET /api/analytics/financial-summary
 */
const getFinancialSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getFinancialSummary({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Financial summary retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get occupancy/utilization rate.
 * @route GET /api/analytics/occupancy
 */
const getOccupancyRate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await analyticsService.getOccupancyRate({
      startDate,
      endDate,
    });

    return sendSuccess(res, 200, 'Occupancy rate retrieved.', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get comprehensive dashboard analytics.
 * @route GET /api/analytics/dashboard
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const [
      patientDemographics,
      doctorPerformance,
      appointmentAnalytics,
      billingRevenue,
      prescriptionTrends,
      financialSummary,
      occupancyRate,
    ] = await Promise.all([
      analyticsService.getPatientDemographics({ startDate, endDate }),
      analyticsService.getDoctorPerformance({ startDate, endDate }),
      analyticsService.getAppointmentAnalytics({ startDate, endDate }),
      analyticsService.getBillingRevenue({ startDate, endDate }),
      analyticsService.getPrescriptionTrends({ startDate, endDate }),
      analyticsService.getFinancialSummary({ startDate, endDate }),
      analyticsService.getOccupancyRate({ startDate, endDate }),
    ]);

    const dashboard = {
      patientDemographics,
      doctorPerformance,
      appointmentAnalytics,
      billingRevenue,
      prescriptionTrends,
      financialSummary,
      occupancyRate,
    };

    return sendSuccess(res, 200, 'Dashboard analytics retrieved.', dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientDemographics,
  getDoctorPerformance,
  getAppointmentAnalytics,
  getBillingRevenue,
  getPrescriptionTrends,
  getFinancialSummary,
  getOccupancyRate,
  getDashboardAnalytics,
};
