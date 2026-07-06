'use strict';

const Doctor = require('../models/Doctor');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Doctor Service — all doctor business logic.
 */

/**
 * Create a new doctor profile.
 * @param {object} doctorData - doctor details (userId, specialization, qualifications, etc.)
 * @param {string} createdBy - ID of the user creating the record
 * @returns {Promise<Doctor>}
 */
const createDoctor = async (doctorData, createdBy) => {
  // Check if user exists and is a doctor
  const user = await User.findById(doctorData.userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'doctor') {
    const error = new Error('User must have a "doctor" role.');
    error.statusCode = 400;
    throw error;
  }

  // Check if a doctor profile already exists for this user
  const existingDoctor = await Doctor.findOne({ userId: doctorData.userId });
  if (existingDoctor) {
    const error = new Error('A doctor profile already exists for this user.');
    error.statusCode = 409;
    throw error;
  }

  // Check if license number is unique
  if (doctorData.licenseNumber) {
    const existingLicense = await Doctor.findOne({ licenseNumber: doctorData.licenseNumber });
    if (existingLicense) {
      const error = new Error('A doctor with this license number already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const doctor = await Doctor.create({
    ...doctorData,
    createdBy,
  });

  // Populate user details
  await doctor.populate('userId', 'firstName lastName email phone');
  await doctor.populate('createdBy', 'firstName lastName email');

  logger.info(`Doctor profile created: ${doctor.doctorId} for user: ${doctorData.userId}`);
  return doctor;
};

/**
 * Retrieve a paginated list of doctors with filtering by specialization.
 * @param {object} queryOptions - { page, limit, search, specialization, isVerified, sort }
 * @returns {Promise<{ doctors, total, page, limit }>}
 */
const getDoctors = async ({
  page = 1,
  limit = 10,
  search = '',
  specialization,
  isVerified,
  sort = '-createdAt',
}) => {
  const query = {};

  // Apply filters
  if (specialization) {
    query.specialization = specialization;
  }

  if (isVerified !== undefined) {
    query.isVerified = isVerified === 'true' || isVerified === true;
  }

  // Apply search (on name, email, phone, doctorId, licenseNumber)
  if (search) {
    const cleanSearch = search.trim();
    // We need to search through the related User documents as well
    const matchingUsers = await User.find({
      $or: [
        { firstName: { $regex: cleanSearch, $options: 'i' } },
        { lastName: { $regex: cleanSearch, $options: 'i' } },
        { email: { $regex: cleanSearch, $options: 'i' } },
        { phone: { $regex: cleanSearch, $options: 'i' } },
      ],
    });
    const userIds = matchingUsers.map((u) => u._id);

    query.$or = [
      { userId: { $in: userIds } },
      { doctorId: { $regex: cleanSearch, $options: 'i' } },
      { licenseNumber: { $regex: cleanSearch, $options: 'i' } },
      { specialization: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  // Calculate skip
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('createdBy', 'firstName lastName email role')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
    Doctor.countDocuments(query),
  ]);

  return {
    doctors,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Retrieve doctor by ID.
 * @param {string} id - doctor MongoDB ID
 * @returns {Promise<Doctor>}
 */
const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id)
    .populate('userId', 'firstName lastName email phone')
    .populate('createdBy', 'firstName lastName email role');

  if (!doctor) {
    const error = new Error('Doctor not found.');
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

/**
 * Retrieve doctor by userId.
 * @param {string} userId - User MongoDB ID
 * @returns {Promise<Doctor>}
 */
const getDoctorByUserId = async (userId) => {
  const doctor = await Doctor.findOne({ userId })
    .populate('userId', 'firstName lastName email phone')
    .populate('createdBy', 'firstName lastName email role');

  if (!doctor) {
    const error = new Error('Doctor profile not found for this user.');
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

/**
 * Update doctor details.
 * @param {string} id - doctor MongoDB ID
 * @param {object} updateData - updated doctor details
 * @returns {Promise<Doctor>}
 */
const updateDoctor = async (id, updateData) => {
  // If license number is changing, check duplicate
  if (updateData.licenseNumber) {
    const existingLicense = await Doctor.findOne({
      licenseNumber: updateData.licenseNumber,
      _id: { $ne: id },
    });
    if (existingLicense) {
      const error = new Error('A doctor with this license number already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('userId', 'firstName lastName email phone')
    .populate('createdBy', 'firstName lastName email role');

  if (!doctor) {
    const error = new Error('Doctor not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Doctor updated: ${doctor.doctorId}`);
  return doctor;
};

/**
 * Soft delete a doctor record.
 * @param {string} id - doctor MongoDB ID
 * @returns {Promise<Doctor>}
 */
const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      isActive: false,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!doctor) {
    const error = new Error('Doctor not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Doctor soft deleted: ${doctor.doctorId}`);
  return doctor;
};

/**
 * Get doctors by specialization.
 * @param {string} specialization - doctor specialization
 * @param {object} options - { page, limit }
 * @returns {Promise<{ doctors, total }>}
 */
const getDoctorsBySpecialization = async (specialization, { page = 1, limit = 10 } = {}) => {
  const query = {
    specialization,
    isActive: true,
    isVerified: true,
  };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .populate('userId', 'firstName lastName email phone')
      .sort('yearsOfExperience')
      .skip(skip)
      .limit(parsedLimit),
    Doctor.countDocuments(query),
  ]);

  return { doctors, total, page: parsedPage, limit: parsedLimit };
};

/**
 * Check doctor availability for a specific date and time.
 * @param {string} doctorId - doctor MongoDB ID
 * @param {Date} appointmentDate - date of appointment
 * @param {string} startTime - start time (HH:MM format)
 * @param {string} endTime - end time (HH:MM format)
 * @returns {Promise<boolean>}
 */
const isDoctorAvailable = async (doctorId, appointmentDate, startTime, endTime) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return false;
  }

  const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const slot = doctor.availability.find((s) => s.dayOfWeek === dayOfWeek && s.isAvailable);

  return !!slot;
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization,
  isDoctorAvailable,
};
