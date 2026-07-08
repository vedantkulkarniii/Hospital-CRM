'use strict';

const prescriptionService = require('../services/prescription.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new prescription.
 * @route POST /api/prescriptions
 */
const createPrescription = async (req, res, next) => {
  try {
    const prescriptionData = req.body;
    const userId = req.user._id || req.user.id;

    const prescription = await prescriptionService.createPrescription(prescriptionData, userId);

    return sendSuccess(res, 201, 'Prescription created successfully.', prescription);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve prescriptions (paginated, sorted, filtered).
 * @route GET /api/prescriptions
 */
const getPrescriptions = async (req, res, next) => {
  try {
    const { page, limit, search, patient, doctor, sort } = req.query;

    const { prescriptions, total, page: currentPage, limit: currentLimit } = await prescriptionService.getPrescriptions({
      page,
      limit,
      search,
      patient,
      doctor,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Prescriptions retrieved successfully.', prescriptions, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve a single prescription by ID.
 * @route GET /api/prescriptions/:id
 */
const getPrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await prescriptionService.getPrescriptionById(id);

    return sendSuccess(res, 200, 'Prescription details retrieved successfully.', prescription);
  } catch (error) {
    next(error);
  }
};

/**
 * Update prescription details.
 * @route PUT /api/prescriptions/:id
 */
const updatePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const prescription = await prescriptionService.updatePrescription(id, updateData);

    return sendSuccess(res, 200, 'Prescription updated successfully.', prescription);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a prescription.
 * @route DELETE /api/prescriptions/:id
 */
const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await prescriptionService.deletePrescription(id);

    return sendSuccess(res, 200, 'Prescription deleted successfully.', prescription);
  } catch (error) {
    next(error);
  }
};

/**
 * Get prescriptions by patient.
 * @route GET /api/prescriptions/patient/:patientId
 */
const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { prescriptions, total, page: currentPage, limit: currentLimit } = await prescriptionService.getPrescriptionsByPatient(
      patientId,
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Patient prescriptions retrieved successfully.', prescriptions, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get prescriptions by doctor.
 * @route GET /api/prescriptions/doctor/:doctorId
 */
const getPrescriptionsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { prescriptions, total, page: currentPage, limit: currentLimit } = await prescriptionService.getPrescriptionsByDoctor(
      doctorId,
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Doctor prescriptions retrieved successfully.', prescriptions, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Export prescription as PDF.
 * @route GET /api/prescriptions/:id/export-pdf
 */
const exportPrescriptionPDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pdfBuffer = await prescriptionService.exportPrescriptionPDF(id);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="prescription-${id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  exportPrescriptionPDF,
};
