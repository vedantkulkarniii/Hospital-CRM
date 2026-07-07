'use strict';

const appointmentService = require('../services/appointment.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new appointment.
 * @route POST /api/appointments
 */
const createAppointment = async (req, res, next) => {
  try {
    const appointmentData = req.body;
    const userId = req.user._id || req.user.id;

    const appointment = await appointmentService.createAppointment(appointmentData, userId);

    return sendSuccess(res, 201, 'Appointment booked successfully.', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve appointments (paginated, sorted, filtered).
 * @route GET /api/appointments
 */
const getAppointments = async (req, res, next) => {
  try {
    const { page, limit, search, date, doctor, patient, status, sort } = req.query;

    const { appointments, total, page: currentPage, limit: currentLimit } = await appointmentService.getAppointments({
      page,
      limit,
      search,
      date,
      doctor,
      patient,
      status,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Appointments retrieved successfully.', appointments, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single appointment by ID.
 * @route GET /api/appointments/:id
 */
const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);

    return sendSuccess(res, 200, 'Appointment details retrieved successfully.', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment details.
 * @route PUT /api/appointments/:id
 */
const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const appointment = await appointmentService.updateAppointment(id, updateData);

    return sendSuccess(res, 200, 'Appointment updated successfully.', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel an appointment.
 * @route PATCH /api/appointments/:id/cancel
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const user = req.user;

    // Determine who is cancelling
    let cancelledBy = 'system';
    if (user.role === 'patient') {
      cancelledBy = 'patient';
    } else if (user.role === 'doctor') {
      cancelledBy = 'doctor';
    } else if (user.role === 'receptionist' || user.role === 'admin') {
      cancelledBy = 'receptionist';
    }

    const appointment = await appointmentService.cancelAppointment(id, cancelledBy, cancellationReason || '');

    return sendSuccess(res, 200, 'Appointment cancelled successfully.', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete an appointment.
 * @route DELETE /api/appointments/:id
 */
const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.deleteAppointment(id);

    return sendSuccess(res, 200, 'Appointment deleted successfully.', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get today's appointments.
 * @route GET /api/appointments/today
 */
const getTodayAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { appointments, total, page: currentPage, limit: currentLimit } = await appointmentService.getTodayAppointments({
      page,
      limit,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, "Today's appointments retrieved successfully.", appointments, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointments by date range.
 * @route GET /api/appointments/range
 */
const getAppointmentsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!startDate || !endDate) {
      const error = new Error('startDate and endDate query parameters are required.');
      error.statusCode = 400;
      throw error;
    }

    const { appointments, total, page: currentPage, limit: currentLimit } = await appointmentService.getAppointmentsByDateRange(
      new Date(startDate),
      new Date(endDate),
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Appointments in date range retrieved successfully.', appointments, meta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  getTodayAppointments,
  getAppointmentsByDateRange,
};
