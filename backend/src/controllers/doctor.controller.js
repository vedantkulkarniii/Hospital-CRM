'use strict';

const doctorService = require('../services/doctor.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

const createDoctor = async (req, res, next) => {
  try {
    const doctorData = req.body;
    const userId = req.user._id || req.user.id;

    const doctor = await doctorService.createDoctor(doctorData, userId);

    return sendSuccess(res, 201, 'Doctor record created successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const { page, limit, search, specialization, sort } = req.query;

    const { doctors, total, page: currentPage, limit: currentLimit } = await doctorService.getDoctors({
      page,
      limit,
      search,
      specialization,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Doctors retrieved successfully.', doctors, meta);
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);

    return sendSuccess(res, 200, 'Doctor details retrieved successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await doctorService.updateDoctor(id, updateData);

    return sendSuccess(res, 200, 'Doctor record updated successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.deleteDoctor(id);

    return sendSuccess(res, 200, 'Doctor record deleted successfully.', doctor);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
