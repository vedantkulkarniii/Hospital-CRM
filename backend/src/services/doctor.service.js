'use strict';

const Doctor = require('../models/Doctor');
const logger = require('../utils/logger');

const createDoctor = async (doctorData, userId) => {
  if (doctorData.email) {
    const existingEmail = await Doctor.findOne({ email: doctorData.email.toLowerCase() });
    if (existingEmail) {
      const error = new Error('A doctor with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const existingPhone = await Doctor.findOne({ phone: doctorData.phone });
  if (existingPhone) {
    const error = new Error('A doctor with this phone number already exists.');
    error.statusCode = 409;
    throw error;
  }

  const doctor = await Doctor.create({
    ...doctorData,
    createdBy: userId,
  });

  logger.info(`Doctor created: ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.doctorId}) by user: ${userId}`);
  return doctor;
};

const getDoctors = async ({
  page = 1,
  limit = 10,
  search = '',
  specialization,
  sort = '-createdAt',
}) => {
  const query = {};

  if (specialization) {
    query.specialization = specialization;
  }

  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { firstName: { $regex: cleanSearch, $options: 'i' } },
      { lastName: { $regex: cleanSearch, $options: 'i' } },
      { email: { $regex: cleanSearch, $options: 'i' } },
      { phone: { $regex: cleanSearch, $options: 'i' } },
      { doctorId: { $regex: cleanSearch, $options: 'i' } },
      { specialization: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [doctors, total] = await Promise.all([
    Doctor.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit)
      .populate('createdBy', 'firstName lastName email role'),
    Doctor.countDocuments(query),
  ]);

  return {
    doctors,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id).populate('createdBy', 'firstName lastName email role');
  if (!doctor) {
    const error = new Error('Doctor not found.');
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

const updateDoctor = async (id, updateData) => {
  if (updateData.email) {
    const existingEmail = await Doctor.findOne({
      email: updateData.email.toLowerCase(),
      _id: { $ne: id },
    });
    if (existingEmail) {
      const error = new Error('A doctor with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  if (updateData.phone) {
    const existingPhone = await Doctor.findOne({
      phone: updateData.phone,
      _id: { $ne: id },
    });
    if (existingPhone) {
      const error = new Error('A doctor with this phone number already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'firstName lastName email role');

  if (!doctor) {
    const error = new Error('Doctor not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Doctor updated: ${doctor.doctorId}`);
  return doctor;
};

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

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
