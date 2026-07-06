'use strict';

const doctorService = require('../services/doctor.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new doctor profile.
 * @route POST /api/doctors
 */
const createDoctor = async (req, res, next) => {
  try {
    const doctorData = req.body;
    const createdBy = req.user._id || req.user.id;

    const doctor = await doctorService.createDoctor(doctorData, createdBy);

    return sendSuccess(res, 201, 'Doctor profile created successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve doctors (paginated, sorted, filtered by specialization).
 * @route GET /api/doctors
 */
const getDoctors = async (req, res, next) => {
  try {
    const { page, limit, search, specialization, isVerified, sort } = req.query;

    const { doctors, total, page: currentPage, limit: currentLimit } = await doctorService.getDoctors({
      page,
      limit,
      search,
      specialization,
      isVerified,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Doctors retrieved successfully.', doctors, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single doctor by ID.
 * @route GET /api/doctors/:id
 */
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);

    return sendSuccess(res, 200, 'Doctor details retrieved successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve doctor profile for the current authenticated user.
 * @route GET /api/doctors/profile/me
 */
const getMyDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const doctor = await doctorService.getDoctorByUserId(userId);

    return sendSuccess(res, 200, 'Doctor profile retrieved successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor details.
 * @route PUT /api/doctors/:id
 */
const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await doctorService.updateDoctor(id, updateData);

    return sendSuccess(res, 200, 'Doctor profile updated successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a doctor record.
 * @route DELETE /api/doctors/:id
 */
const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.deleteDoctor(id);

    return sendSuccess(res, 200, 'Doctor profile deleted successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctors by specialization.
 * @route GET /api/doctors/specialization/:specialization
 */
const getDoctorsBySpecialization = async (req, res, next) => {
  try {
    const { specialization } = req.params;
    const { page, limit } = req.query;

    const { doctors, total, page: currentPage, limit: currentLimit } = await doctorService.getDoctorsBySpecialization(
      specialization,
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, `Doctors with specialization "${specialization}" retrieved successfully.`, doctors, meta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization,
};
