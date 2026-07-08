'use strict';

const PDFDocument = require('pdfkit');

/**
 * Generate a prescription PDF document
 * @param {object} prescription - Prescription data with populated references
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generatePrescriptionPDF = (prescription) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ─── Header ───────────────────────────────────────────────────────────
      doc.fontSize(24).font('Helvetica-Bold').text('PRESCRIPTION', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('Hospital CRM System', { align: 'center' });
      doc.moveDown(0.5);

      // Horizontal line
      doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // ─── Prescription Details ──────────────────────────────────────────────
      const leftX = 50;
      const rightX = 300;
      const colWidth = 250;

      // Row 1: Prescription ID & Date
      doc.fontSize(10).font('Helvetica-Bold').text('Prescription ID:', leftX, doc.y, { width: colWidth });
      doc.font('Helvetica').text(prescription.prescriptionId || 'N/A', leftX, doc.y, { width: colWidth });

      doc.fontSize(10).font('Helvetica-Bold').text('Date:', rightX, doc.y - 18, { width: colWidth });
      const dateStr = prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A';
      doc.font('Helvetica').text(dateStr, rightX, doc.y, { width: colWidth });

      doc.moveDown(1.2);

      // ─── Patient Information ──────────────────────────────────────────────
      doc.fontSize(12).font('Helvetica-Bold').text('Patient Information', { underline: true });
      doc.moveDown(0.3);

      const patient = prescription.patient || {};
      doc.fontSize(10).font('Helvetica').text(`Name: ${patient.firstName || ''} ${patient.lastName || ''}`, leftX);
      doc.text(`ID: ${patient.patientId || 'N/A'}`, leftX);
      doc.text(`Email: ${patient.email || 'N/A'}`, leftX);

      doc.moveDown(0.8);

      // ─── Doctor Information ───────────────────────────────────────────────
      doc.fontSize(12).font('Helvetica-Bold').text('Doctor Information', { underline: true });
      doc.moveDown(0.3);

      const doctor = prescription.doctor || {};
      doc.fontSize(10).font('Helvetica').text(`Name: ${doctor.firstName || ''} ${doctor.lastName || ''}`, leftX);
      doc.text(`ID: ${doctor.doctorId || 'N/A'}`, leftX);
      doc.text(`Specialization: ${doctor.specialization || 'N/A'}`, leftX);

      doc.moveDown(0.8);

      // ─── Diagnosis & Clinical Notes ───────────────────────────────────────
      doc.fontSize(12).font('Helvetica-Bold').text('Diagnosis', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(prescription.diagnosis || 'N/A', { align: 'left' });

      if (prescription.clinicalNotes) {
        doc.moveDown(0.8);
        doc.fontSize(12).font('Helvetica-Bold').text('Clinical Notes', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').text(prescription.clinicalNotes, { align: 'left' });
      }

      doc.moveDown(1);

      // ─── Medications ──────────────────────────────────────────────────────
      doc.fontSize(12).font('Helvetica-Bold').text('Medications', { underline: true });
      doc.moveDown(0.5);

      const medications = prescription.medications || [];
      if (medications.length > 0) {
        medications.forEach((med, index) => {
          doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. ${med.name}`, leftX);
          doc.fontSize(9).font('Helvetica')
            .text(`   Dosage: ${med.dosage || 'N/A'}`, leftX)
            .text(`   Frequency: ${med.frequency || 'N/A'}`, leftX)
            .text(`   Duration: ${med.duration || 'N/A'}`, leftX);

          if (med.instructions) {
            doc.text(`   Instructions: ${med.instructions}`, leftX);
          }
          doc.moveDown(0.4);
        });
      } else {
        doc.fontSize(10).font('Helvetica').text('No medications prescribed.', leftX);
      }

      // ─── Additional Instructions ──────────────────────────────────────────
      if (prescription.instructions) {
        doc.moveDown(0.8);
        doc.fontSize(12).font('Helvetica-Bold').text('Additional Instructions', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').text(prescription.instructions, leftX);
      }

      // ─── Follow-up ────────────────────────────────────────────────────────
      if (prescription.followUpDate) {
        doc.moveDown(0.8);
        doc.fontSize(12).font('Helvetica-Bold').text('Follow-up', { underline: true });
        doc.moveDown(0.3);
        const followUpDateStr = new Date(prescription.followUpDate).toLocaleDateString();
        doc.fontSize(10).font('Helvetica').text(`Follow-up Date: ${followUpDateStr}`, leftX);
        if (prescription.followUpNotes) {
          doc.text(`Notes: ${prescription.followUpNotes}`, leftX);
        }
      }

      doc.moveDown(1);

      // ─── Footer ───────────────────────────────────────────────────────────
      doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      doc.fontSize(8).font('Helvetica').text(
        'This is a system-generated document. For official use only.',
        { align: 'center', color: '#666666' },
      );
      doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center', color: '#666666' });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Export prescription as PDF stream
 * @param {object} prescription - Prescription data
 * @returns {Readable} - PDF stream
 */
const generatePrescriptionStream = (prescription) => {
  const doc = new PDFDocument();

  // ─── Header ───────────────────────────────────────────────────────────
  doc.fontSize(24).font('Helvetica-Bold').text('PRESCRIPTION', { align: 'center' });
  doc.fontSize(10).font('Helvetica').text('Hospital CRM System', { align: 'center' });
  doc.moveDown(0.5);

  // Horizontal line
  doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // ─── Prescription Details ──────────────────────────────────────────────
  const leftX = 50;
  const rightX = 300;
  const colWidth = 250;

  // Row 1: Prescription ID & Date
  doc.fontSize(10).font('Helvetica-Bold').text('Prescription ID:', leftX, doc.y, { width: colWidth });
  doc.font('Helvetica').text(prescription.prescriptionId || 'N/A', leftX, doc.y, { width: colWidth });

  doc.fontSize(10).font('Helvetica-Bold').text('Date:', rightX, doc.y - 18, { width: colWidth });
  const dateStr = prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A';
  doc.font('Helvetica').text(dateStr, rightX, doc.y, { width: colWidth });

  doc.moveDown(1.2);

  // ─── Patient Information ──────────────────────────────────────────────
  doc.fontSize(12).font('Helvetica-Bold').text('Patient Information', { underline: true });
  doc.moveDown(0.3);

  const patient = prescription.patient || {};
  doc.fontSize(10).font('Helvetica').text(`Name: ${patient.firstName || ''} ${patient.lastName || ''}`, leftX);
  doc.text(`ID: ${patient.patientId || 'N/A'}`, leftX);
  doc.text(`Email: ${patient.email || 'N/A'}`, leftX);

  doc.moveDown(0.8);

  // ─── Doctor Information ───────────────────────────────────────────────
  doc.fontSize(12).font('Helvetica-Bold').text('Doctor Information', { underline: true });
  doc.moveDown(0.3);

  const doctor = prescription.doctor || {};
  doc.fontSize(10).font('Helvetica').text(`Name: ${doctor.firstName || ''} ${doctor.lastName || ''}`, leftX);
  doc.text(`ID: ${doctor.doctorId || 'N/A'}`, leftX);
  doc.text(`Specialization: ${doctor.specialization || 'N/A'}`, leftX);

  doc.moveDown(0.8);

  // ─── Diagnosis & Clinical Notes ───────────────────────────────────────
  doc.fontSize(12).font('Helvetica-Bold').text('Diagnosis', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica').text(prescription.diagnosis || 'N/A', { align: 'left' });

  if (prescription.clinicalNotes) {
    doc.moveDown(0.8);
    doc.fontSize(12).font('Helvetica-Bold').text('Clinical Notes', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').text(prescription.clinicalNotes, { align: 'left' });
  }

  doc.moveDown(1);

  // ─── Medications ──────────────────────────────────────────────────────
  doc.fontSize(12).font('Helvetica-Bold').text('Medications', { underline: true });
  doc.moveDown(0.5);

  const medications = prescription.medications || [];
  if (medications.length > 0) {
    medications.forEach((med, index) => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. ${med.name}`, leftX);
      doc.fontSize(9).font('Helvetica')
        .text(`   Dosage: ${med.dosage || 'N/A'}`, leftX)
        .text(`   Frequency: ${med.frequency || 'N/A'}`, leftX)
        .text(`   Duration: ${med.duration || 'N/A'}`, leftX);

      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`, leftX);
      }
      doc.moveDown(0.4);
    });
  } else {
    doc.fontSize(10).font('Helvetica').text('No medications prescribed.', leftX);
  }

  // ─── Additional Instructions ──────────────────────────────────────────
  if (prescription.instructions) {
    doc.moveDown(0.8);
    doc.fontSize(12).font('Helvetica-Bold').text('Additional Instructions', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').text(prescription.instructions, leftX);
  }

  // ─── Follow-up ────────────────────────────────────────────────────────
  if (prescription.followUpDate) {
    doc.moveDown(0.8);
    doc.fontSize(12).font('Helvetica-Bold').text('Follow-up', { underline: true });
    doc.moveDown(0.3);
    const followUpDateStr = new Date(prescription.followUpDate).toLocaleDateString();
    doc.fontSize(10).font('Helvetica').text(`Follow-up Date: ${followUpDateStr}`, leftX);
    if (prescription.followUpNotes) {
      doc.text(`Notes: ${prescription.followUpNotes}`, leftX);
    }
  }

  doc.moveDown(1);

  // ─── Footer ───────────────────────────────────────────────────────────
  doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  doc.fontSize(8).font('Helvetica').text(
    'This is a system-generated document. For official use only.',
    { align: 'center', color: '#666666' },
  );
  doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center', color: '#666666' });

  doc.end();
  return doc;
};

module.exports = {
  generatePrescriptionPDF,
  generatePrescriptionStream,
};
