'use strict';

const Patient = require('../models/Patient');
const logger = require('../utils/logger');

/**
 * Patient Service — all patient business logic.
 */

/**
 * Create a new patient.
 * @param {object} patientData - patient details
 * @param {string} userId - ID of the user creating the record
 * @returns {Promise<Patient>}
 */
const createPatient = async (patientData, userId) => {
  // Check if a patient with the same phone or email already exists to prevent duplicates
  // Note: we check only active patients (isDeleted: false)
  if (patientData.email) {
    const existingEmail = await Patient.findOne({ email: patientData.email.toLowerCase() });
    if (existingEmail) {
      const error = new Error('A patient with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const existingPhone = await Patient.findOne({ phone: patientData.phone });
  if (existingPhone) {
    const error = new Error('A patient with this phone number already exists.');
    error.statusCode = 409;
    throw error;
  }

  const patient = await Patient.create({
    ...patientData,
    createdBy: userId,
  });

  logger.info(`Patient created: ${patient.firstName} ${patient.lastName} (ID: ${patient.patientId}) by user: ${userId}`);
  return patient;
};

/**
 * Retrieve a paginated list of patients with search and filtering.
 * @param {object} queryOptions - { page, limit, search, gender, bloodGroup, sort }
 * @returns {Promise<{ patients, total, page, limit }>}
 */
const getPatients = async ({
  page = 1,
  limit = 10,
  search = '',
  gender,
  bloodGroup,
  sort = '-createdAt',
}) => {
  const query = {};

  // Apply filters
  if (gender) {
    query.gender = gender;
  }
  
  if (bloodGroup) {
    query.bloodGroup = bloodGroup;
  }

  // Apply search (on name, email, phone, patientId)
  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { firstName: { $regex: cleanSearch, $options: 'i' } },
      { lastName: { $regex: cleanSearch, $options: 'i' } },
      { email: { $regex: cleanSearch, $options: 'i' } },
      { phone: { $regex: cleanSearch, $options: 'i' } },
      { patientId: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  // Calculate skip
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  const [patients, total] = await Promise.all([
    Patient.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit)
      .populate('createdBy', 'firstName lastName email role'),
    Patient.countDocuments(query),
  ]);

  return {
    patients,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Retrieve patient by ID.
 * @param {string} id - patient MongoDB ID
 * @returns {Promise<Patient>}
 */
const getPatientById = async (id) => {
  const patient = await Patient.findById(id).populate('createdBy', 'firstName lastName email role');
  if (!patient) {
    const error = new Error('Patient not found.');
    error.statusCode = 404;
    throw error;
  }
  return patient;
};

/**
 * Update patient details.
 * @param {string} id - patient MongoDB ID
 * @param {object} updateData - updated patient details
 * @returns {Promise<Patient>}
 */
const updatePatient = async (id, updateData) => {
  // If email is changing, check duplicate email
  if (updateData.email) {
    const existingEmail = await Patient.findOne({
      email: updateData.email.toLowerCase(),
      _id: { $ne: id },
    });
    if (existingEmail) {
      const error = new Error('A patient with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  // If phone is changing, check duplicate phone
  if (updateData.phone) {
    const existingPhone = await Patient.findOne({
      phone: updateData.phone,
      _id: { $ne: id },
    });
    if (existingPhone) {
      const error = new Error('A patient with this phone number already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const patient = await Patient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'firstName lastName email role');

  if (!patient) {
    const error = new Error('Patient not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Patient updated: ${patient.patientId}`);
  return patient;
};

/**
 * Soft delete a patient record.
 * @param {string} id - patient MongoDB ID
 * @returns {Promise<Patient>}
 */
const deletePatient = async (id) => {
  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      isActive: false,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!patient) {
    const error = new Error('Patient not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Patient soft deleted: ${patient.patientId}`);
  return patient;
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
