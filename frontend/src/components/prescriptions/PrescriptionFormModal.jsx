import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Alert from '../common/Alert';
import api from '../../services/api';

const INITIAL_FORM_STATE = {
  appointment: '',
  patient: '',
  doctor: '',
  medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
  diagnosis: '',
  clinicalNotes: '',
  instructions: '',
  followUpDate: '',
  followUpNotes: '',
};

export default function PrescriptionFormModal({
  isOpen,
  onClose,
  onSubmit,
  prescription = null,
  isLoading = false,
  error = null,
  currentUser = null,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [prevPrescription, setPrevPrescription] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && (patients.length === 0 || doctors.length === 0 || appointments.length === 0)) {
      fetchSelectData();
    }
  }, [isOpen]);

  const fetchSelectData = async () => {
    try {
      setLoadingData(true);
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('/appointments', { params: { limit: 100 } }),
        api.get('/patients', { params: { limit: 100 } }),
        api.get('/doctors', { params: { limit: 100 } }),
      ]);

      setAppointments(appointmentsRes.data?.data || []);
      setPatients(patientsRes.data?.data || []);
      setDoctors(doctorsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch select data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  if (prescription !== prevPrescription || isOpen !== prevIsOpen) {
    setPrevPrescription(prescription);
    setPrevIsOpen(isOpen);
    setFormData(
      prescription
        ? {
            appointment: prescription.appointment?._id || '',
            patient: prescription.patient?._id || '',
            doctor: prescription.doctor?._id || '',
            medications: prescription.medications || [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
            diagnosis: prescription.diagnosis || '',
            clinicalNotes: prescription.clinicalNotes || '',
            instructions: prescription.instructions || '',
            followUpDate: prescription.followUpDate?.split('T')[0] || '',
            followUpNotes: prescription.followUpNotes || '',
          }
        : { ...INITIAL_FORM_STATE },
    );
    setErrors({});
  }

  const validate = () => {
    const errs = {};
    if (!formData.appointment) errs.appointment = 'Appointment is required.';
    if (!formData.patient) errs.patient = 'Patient is required.';
    if (!formData.doctor) errs.doctor = 'Doctor is required.';
    if (!formData.diagnosis.trim()) errs.diagnosis = 'Diagnosis is required.';
    if (!formData.medications || formData.medications.length === 0) {
      errs.medications = 'At least one medication is required.';
    }
    return errs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const newMeds = [...formData.medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setFormData((prev) => ({ ...prev, medications: newMeds }));
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      setFormData((prev) => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }
    onSubmit(formData);
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} disabled={isLoading} className="btn-secondary">
        Cancel
      </button>
      <button type="submit" form="prescription-form" disabled={isLoading} className="btn-primary">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Prescription'
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prescription ? 'Edit Prescription' : 'Create New Prescription'}
      size="2xl"
      footer={footer}
    >
      <form id="prescription-form" onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {error && <Alert type="error" message={error} dismissible={false} />}
        {loadingData && <p className="text-sm text-gray-500">Loading data...</p>}

        {/* Appointment, Patient, Doctor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label" htmlFor="appointment">
              Appointment *
            </label>
            <select
              id="appointment"
              name="appointment"
              value={formData.appointment}
              onChange={handleInputChange}
              disabled={loadingData}
              className={`form-input ${errors.appointment ? 'border-red-400' : ''}`}
            >
              <option value="">-- Select --</option>
              {appointments.map((apt) => (
                <option key={apt._id} value={apt._id}>
                  {apt.appointmentId}
                </option>
              ))}
            </select>
            {errors.appointment && <p className="text-xs text-red-500 mt-1">{errors.appointment}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="patient">
              Patient *
            </label>
            <select
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
              disabled={loadingData}
              className={`form-input ${errors.patient ? 'border-red-400' : ''}`}
            >
              <option value="">-- Select --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
            {errors.patient && <p className="text-xs text-red-500 mt-1">{errors.patient}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="doctor">
              Doctor *
            </label>
            <select
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              disabled={loadingData}
              className={`form-input ${errors.doctor ? 'border-red-400' : ''}`}
            >
              <option value="">-- Select --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.userId?.firstName} {d.userId?.lastName}
                </option>
              ))}
            </select>
            {errors.doctor && <p className="text-xs text-red-500 mt-1">{errors.doctor}</p>}
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="form-label" htmlFor="diagnosis">
            Diagnosis *
          </label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            rows="2"
            maxLength="500"
            value={formData.diagnosis}
            onChange={handleInputChange}
            className={`form-input resize-none ${errors.diagnosis ? 'border-red-400' : ''}`}
          />
          {errors.diagnosis && <p className="text-xs text-red-500 mt-1">{errors.diagnosis}</p>}
          <p className="text-xs text-gray-500 mt-1">{formData.diagnosis.length} / 500 characters</p>
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="form-label">Medications *</label>
            {errors.medications && <p className="text-xs text-red-500">{errors.medications}</p>}
          </div>
          {formData.medications.map((med, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g., 500mg)"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g., Twice daily)"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 7 days)"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  className="form-input"
                />
              </div>
              <input
                type="text"
                placeholder="Instructions (optional)"
                value={med.instructions}
                onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                className="form-input"
              />
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMedication} className="text-primary-600 text-sm flex items-center gap-1">
            <Plus size={14} />
            Add Medication
          </button>
        </div>

        {/* Clinical Notes & Instructions */}
        <div>
          <label className="form-label" htmlFor="clinicalNotes">
            Clinical Notes
          </label>
          <textarea
            id="clinicalNotes"
            name="clinicalNotes"
            rows="2"
            maxLength="1000"
            value={formData.clinicalNotes}
            onChange={handleInputChange}
            className="form-input resize-none"
            placeholder="Additional clinical observations"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.clinicalNotes.length} / 1000 characters</p>
        </div>

        {/* Follow-up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="followUpDate">
              Follow-up Date
            </label>
            <input
              id="followUpDate"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="instructions">
              Patient Instructions
            </label>
            <input
              id="instructions"
              name="instructions"
              type="text"
              maxLength="500"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="e.g., Take with food, Avoid dairy"
              className="form-input"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
