'use strict';

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');

/**
 * Appointment Service — all appointment business logic.
 */

/**
 * Check for conflicting appointments (overlapping time slots).
 * @param {string} doctorId - Doctor MongoDB ID
 * @param {Date} appointmentDate - Appointment date
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @param {string} excludeAppointmentId - Appointment ID to exclude (for updates)
 * @returns {Promise<boolean>}
 */
const checkConflict = async (doctorId, appointmentDate, startTime, endTime, excludeAppointmentId = null) => {
  const query = {
    doctor: doctorId,
    appointmentDate: {
      $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
      $lt: new Date(appointmentDate).setHours(23, 59, 59, 999),
    },
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] },
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const existingAppointments = await Appointment.find(query);

  // Check for time overlap
  const [newStartHour, newStartMin] = startTime.split(':').map(Number);
  const [newEndHour, newEndMin] = endTime.split(':').map(Number);
  const newStartTotal = newStartHour * 60 + newStartMin;
  const newEndTotal = newEndHour * 60 + newEndMin;

  return existingAppointments.some((appt) => {
    const [existHour, existMin] = appt.startTime.split(':').map(Number);
    const [existEndHour, existEndMin] = appt.endTime.split(':').map(Number);
    const existStartTotal = existHour * 60 + existMin;
    const existEndTotal = existEndHour * 60 + existEndMin;

    // Check for overlap
    return newStartTotal < existEndTotal && newEndTotal > existStartTotal;
  });
};

/**
 * Create a new appointment.
 * @param {object} appointmentData - appointment details
 * @param {string} userId - ID of the user creating the appointment
 * @returns {Promise<Appointment>}
 */
const createAppointment = async (appointmentData, userId) => {
  // Validate patient exists
  const patient = await Patient.findById(appointmentData.patient);
  if (!patient) {
    const error = new Error('Patient not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate doctor exists
  const doctor = await Doctor.findById(appointmentData.doctor);
  if (!doctor) {
    const error = new Error('Doctor not found.');
    error.statusCode = 404;
    throw error;
  }

  // Check for conflicting appointments (T-106)
  const hasConflict = await checkConflict(
    appointmentData.doctor,
    appointmentData.appointmentDate,
    appointmentData.startTime,
    appointmentData.endTime,
  );

  if (hasConflict) {
    const error = new Error('Doctor has overlapping appointment at this time.');
    error.statusCode = 409;
    throw error;
  }

  // Set consultation fee from doctor profile
  const appointment = await Appointment.create({
    ...appointmentData,
    consultationFee: doctor.consultationFee,
    createdBy: userId,
  });

  // Populate references
  await appointment.populate([
    { path: 'patient', select: 'firstName lastName email phone patientId' },
    { path: 'doctor', select: 'firstName lastName specialization consultationFee doctorId userId' },
    { path: 'createdBy', select: 'firstName lastName email' },
  ]);

  logger.info(`Appointment created: ${appointment.appointmentId} by user: ${userId}`);
  return appointment;
};

/**
 * Retrieve appointments with pagination and filters.
 * @param {object} queryOptions - { page, limit, search, date, doctor, patient, status, sort }
 * @returns {Promise<{ appointments, total, page, limit }>}
 */
const getAppointments = async ({
  page = 1,
  limit = 10,
  search = '',
  date,
  doctor,
  patient,
  status,
  sort = '-appointmentDate',
}) => {
  const query = {};

  // Apply filters
  if (doctor) {
    query.doctor = doctor;
  }

  if (patient) {
    query.patient = patient;
  }

  if (status) {
    query.status = status;
  }

  if (date) {
    // Filter by date range (entire day)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    query.appointmentDate = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  // Apply search (on appointment ID, reason)
  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { appointmentId: { $regex: cleanSearch, $options: 'i' } },
      { reason: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('patient', 'firstName lastName email phone patientId')
      .populate('doctor', 'firstName lastName specialization consultationFee doctorId')
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
    Appointment.countDocuments(query),
  ]);

  return {
    appointments,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Retrieve appointment by ID.
 * @param {string} id - Appointment MongoDB ID
 * @returns {Promise<Appointment>}
 */
const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate('patient', 'firstName lastName email phone patientId dateOfBirth gender bloodGroup')
    .populate('doctor', 'firstName lastName specialization consultationFee doctorId userId')
    .populate('createdBy', 'firstName lastName email');

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

/**
 * Update appointment details.
 * @param {string} id - Appointment MongoDB ID
 * @param {object} updateData - Updated appointment details
 * @returns {Promise<Appointment>}
 */
const updateAppointment = async (id, updateData) => {
  // Get current appointment to check conflict if date/time changed
  const currentAppointment = await Appointment.findById(id);
  if (!currentAppointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  // If date/time is changing, check for conflicts
  if (
    updateData.appointmentDate ||
    updateData.startTime ||
    updateData.endTime ||
    updateData.doctor
  ) {
    const dateToCheck = updateData.appointmentDate || currentAppointment.appointmentDate;
    const startTimeToCheck = updateData.startTime || currentAppointment.startTime;
    const endTimeToCheck = updateData.endTime || currentAppointment.endTime;
    const doctorToCheck = updateData.doctor || currentAppointment.doctor;

    const hasConflict = await checkConflict(
      doctorToCheck,
      dateToCheck,
      startTimeToCheck,
      endTimeToCheck,
      id,
    );

    if (hasConflict) {
      const error = new Error('Doctor has overlapping appointment at this time.');
      error.statusCode = 409;
      throw error;
    }
  }

  const appointment = await Appointment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('patient', 'firstName lastName email phone patientId')
    .populate('doctor', 'firstName lastName specialization consultationFee doctorId')
    .populate('createdBy', 'firstName lastName email');

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Appointment updated: ${appointment.appointmentId}`);
  return appointment;
};

/**
 * Cancel an appointment.
 * @param {string} id - Appointment MongoDB ID
 * @param {string} cancelledBy - Who cancelled (patient, doctor, receptionist, system)
 * @param {string} cancellationReason - Reason for cancellation
 * @returns {Promise<Appointment>}
 */
const cancelAppointment = async (id, cancelledBy = 'system', cancellationReason = '') => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      status: 'cancelled',
      cancelledBy,
      cancellationReason,
      cancelledAt: new Date(),
    },
    { new: true },
  )
    .populate('patient', 'firstName lastName email phone patientId')
    .populate('doctor', 'firstName lastName specialization doctorId')
    .populate('createdBy', 'firstName lastName email');

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Appointment cancelled: ${appointment.appointmentId}`);
  return appointment;
};

/**
 * Soft delete an appointment.
 * @param {string} id - Appointment MongoDB ID
 * @returns {Promise<Appointment>}
 */
const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Appointment soft deleted: ${appointment.appointmentId}`);
  return appointment;
};

/**
 * Get appointments by date range.
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {object} options - { page, limit }
 * @returns {Promise<{ appointments, total }>}
 */
const getAppointmentsByDateRange = async (startDate, endDate, { page = 1, limit = 10 } = {}) => {
  const query = {
    appointmentDate: {
      $gte: startDate,
      $lte: endDate,
    },
    status: { $ne: 'cancelled' },
  };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialization')
      .sort('appointmentDate')
      .skip(skip)
      .limit(parsedLimit),
    Appointment.countDocuments(query),
  ]);

  return { appointments, total, page: parsedPage, limit: parsedLimit };
};

/**
 * Get today's appointments.
 * @param {object} options - { page, limit }
 * @returns {Promise<{ appointments, total }>}
 */
const getTodayAppointments = async ({ page = 1, limit = 10 } = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getAppointmentsByDateRange(today, tomorrow, { page, limit });
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  getAppointmentsByDateRange,
  getTodayAppointments,
  checkConflict,
};
