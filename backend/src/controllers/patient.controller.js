'use strict';

const patientService = require('../services/patient.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new patient.
 * @route POST /api/patients
 */
const createPatient = async (req, res, next) => {
  try {
    const patientData = req.body;
    const userId = req.user._id || req.user.id;

    const patient = await patientService.createPatient(patientData, userId);

    return sendSuccess(res, 201, 'Patient record created successfully.', patient);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve patients (paginated, sorted, filtered).
 * @route GET /api/patients
 */
const getPatients = async (req, res, next) => {
  try {
    const { page, limit, search, gender, bloodGroup, sort } = req.query;

    const { patients, total, page: currentPage, limit: currentLimit } = await patientService.getPatients({
      page,
      limit,
      search,
      gender,
      bloodGroup,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Patients retrieved successfully.', patients, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single patient by ID.
 * @route GET /api/patients/:id
 */
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);

    return sendSuccess(res, 200, 'Patient details retrieved successfully.', patient);
  } catch (error) {
    next(error);
  }
};

/**
 * Update patient details.
 * @route PUT /api/patients/:id
 */
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await patientService.updatePatient(id, updateData);

    return sendSuccess(res, 200, 'Patient record updated successfully.', patient);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a patient record.
 * @route DELETE /api/patients/:id
 */
const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await patientService.deletePatient(id);

    return sendSuccess(res, 200, 'Patient record deleted successfully.', patient);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
