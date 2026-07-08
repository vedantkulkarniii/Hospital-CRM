import { Download, User, Stethoscope, Pill, FileText, Calendar } from 'lucide-react';
import { useState } from 'react';
import prescriptionService from '../../services/prescriptionService.js';

export default function PrescriptionDetailView({ prescription, onEdit, onDelete, isStaff }) {
  const [isExporting, setIsExporting] = useState(false);

  if (!prescription) return null;

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const pdfBlob = await prescriptionService.exportPrescriptionPDF(prescription._id);

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${prescription.prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export prescription as PDF:', error);
      alert('Failed to export prescription as PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{prescription.prescriptionId}</h2>
          <p className="text-gray-600 mt-1">
            {new Date(prescription.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${prescription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {prescription.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Patient</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {prescription.patient?.firstName} {prescription.patient?.lastName}
            </p>
            <p className="text-sm text-gray-600">{prescription.patient?.patientId}</p>
            {prescription.patient?.email && (
              <p className="text-sm text-gray-600 mt-2">{prescription.patient.email}</p>
            )}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={20} className="text-green-600" />
            <h3 className="font-bold text-gray-900">Doctor</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
            </p>
            <p className="text-sm text-gray-600">{prescription.doctor?.specialization}</p>
            <p className="text-sm text-gray-600">{prescription.doctor?.doctorId}</p>
          </div>
        </div>
      </div>

      {/* Diagnosis & Clinical Notes */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-purple-600" />
          <h3 className="font-bold text-gray-900">Diagnosis & Clinical Information</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Diagnosis</p>
            <p className="text-sm text-gray-900 mt-2">{prescription.diagnosis}</p>
          </div>
          {prescription.clinicalNotes && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Clinical Notes</p>
              <p className="text-sm text-gray-900 mt-2">{prescription.clinicalNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Medications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Pill size={20} className="text-orange-600" />
          <h3 className="font-bold text-gray-900">Medications</h3>
        </div>
        <div className="space-y-4">
          {prescription.medications && prescription.medications.length > 0 ? (
            prescription.medications.map((med, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <p className="font-semibold text-gray-900">{med.name}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Dosage</p>
                    <p className="text-gray-900 font-medium mt-1">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Frequency</p>
                    <p className="text-gray-900 font-medium mt-1">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Duration</p>
                    <p className="text-gray-900 font-medium mt-1">{med.duration}</p>
                  </div>
                  {med.instructions && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Instructions</p>
                      <p className="text-gray-900 font-medium mt-1">{med.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No medications prescribed.</p>
          )}
        </div>
      </div>

      {/* Additional Instructions */}
      {prescription.instructions && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-3">Additional Instructions</h3>
          <p className="text-sm text-gray-900">{prescription.instructions}</p>
        </div>
      )}

      {/* Follow-up */}
      {prescription.followUpDate && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Follow-up</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-900">
              <span className="text-gray-600">Scheduled for:</span>{' '}
              <span className="font-semibold">
                {new Date(prescription.followUpDate).toLocaleDateString()}
              </span>
            </p>
            {prescription.followUpNotes && (
              <p className="text-sm text-gray-900">
                <span className="text-gray-600">Notes:</span> {prescription.followUpNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="btn-primary flex items-center gap-2"
        >
          <Download size={18} />
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </button>

        {isStaff && (
          <>
            <button onClick={onEdit} className="btn-secondary">
              Edit Prescription
            </button>
            <button onClick={onDelete} className="btn-secondary text-red-600 hover:bg-red-50">
              Delete Prescription
            </button>
          </>
        )}
      </div>
    </div>
  );
}
