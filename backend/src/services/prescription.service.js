'use strict';

const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const logger = require('../utils/logger');

/**
 * Prescription Service — all prescription business logic.
 */

/**
 * Create a new prescription.
 * @param {object} prescriptionData - prescription details
 * @param {string} userId - ID of the user creating the prescription
 * @returns {Promise<Prescription>}
 */
const createPrescription = async (prescriptionData, userId) => {
  // Validate appointment exists
  const appointment = await Appointment.findById(prescriptionData.appointment);
  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  const prescription = await Prescription.create({
    ...prescriptionData,
    createdBy: userId,
  });

  // Populate references
  await prescription.populate([
    { path: 'patient', select: 'firstName lastName patientId email' },
    { path: 'doctor', select: 'firstName lastName specialization doctorId' },
    { path: 'appointment', select: 'appointmentId appointmentDate startTime endTime' },
    { path: 'createdBy', select: 'firstName lastName email' },
  ]);

  logger.info(`Prescription created: ${prescription.prescriptionId} for appointment: ${appointment.appointmentId}`);
  return prescription;
};

/**
 * Retrieve prescriptions with pagination and filters.
 * @param {object} queryOptions - { page, limit, search, patient, doctor, sort }
 * @returns {Promise<{ prescriptions, total, page, limit }>}
 */
const getPrescriptions = async ({
  page = 1,
  limit = 10,
  search = '',
  patient,
  doctor,
  sort = '-createdAt',
}) => {
  const query = {};

  // Apply filters
  if (patient) {
    query.patient = patient;
  }

  if (doctor) {
    query.doctor = doctor;
  }

  // Apply search (on prescription ID, diagnosis)
  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { prescriptionId: { $regex: cleanSearch, $options: 'i' } },
      { diagnosis: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentId appointmentDate')
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
    Prescription.countDocuments(query),
  ]);

  return {
    prescriptions,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Retrieve prescription by ID.
 * @param {string} id - Prescription MongoDB ID
 * @returns {Promise<Prescription>}
 */
const getPrescriptionById = async (id) => {
  const prescription = await Prescription.findById(id)
    .populate('patient', 'firstName lastName email phone patientId dateOfBirth gender')
    .populate('doctor', 'firstName lastName specialization phone doctorId')
    .populate('appointment', 'appointmentId appointmentDate startTime endTime reason')
    .populate('createdBy', 'firstName lastName email');

  if (!prescription) {
    const error = new Error('Prescription not found.');
    error.statusCode = 404;
    throw error;
  }

  return prescription;
};

/**
 * Update prescription details.
 * @param {string} id - Prescription MongoDB ID
 * @param {object} updateData - Updated prescription details
 * @returns {Promise<Prescription>}
 */
const updatePrescription = async (id, updateData) => {
  const prescription = await Prescription.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('patient', 'firstName lastName patientId')
    .populate('doctor', 'firstName lastName specialization')
    .populate('appointment', 'appointmentId appointmentDate')
    .populate('createdBy', 'firstName lastName');

  if (!prescription) {
    const error = new Error('Prescription not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Prescription updated: ${prescription.prescriptionId}`);
  return prescription;
};

/**
 * Soft delete a prescription.
 * @param {string} id - Prescription MongoDB ID
 * @returns {Promise<Prescription>}
 */
const deletePrescription = async (id) => {
  const prescription = await Prescription.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!prescription) {
    const error = new Error('Prescription not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Prescription soft deleted: ${prescription.prescriptionId}`);
  return prescription;
};

/**
 * Get prescriptions by patient.
 * @param {string} patientId - Patient MongoDB ID
 * @param {object} options - { page, limit }
 * @returns {Promise<{ prescriptions, total }>}
 */
const getPrescriptionsByPatient = async (patientId, { page = 1, limit = 10 } = {}) => {
  const query = { patient: patientId };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentDate')
      .sort('-createdAt')
      .skip(skip)
      .limit(parsedLimit),
    Prescription.countDocuments(query),
  ]);

  return { prescriptions, total, page: parsedPage, limit: parsedLimit };
};

/**
 * Get prescriptions by doctor.
 * @param {string} doctorId - Doctor MongoDB ID
 * @param {object} options - { page, limit }
 * @returns {Promise<{ prescriptions, total }>}
 */
const getPrescriptionsByDoctor = async (doctorId, { page = 1, limit = 10 } = {}) => {
  const query = { doctor: doctorId };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .populate('patient', 'firstName lastName patientId')
      .sort('-createdAt')
      .skip(skip)
      .limit(parsedLimit),
    Prescription.countDocuments(query),
  ]);

  return { prescriptions, total, page: parsedPage, limit: parsedLimit };
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
};
