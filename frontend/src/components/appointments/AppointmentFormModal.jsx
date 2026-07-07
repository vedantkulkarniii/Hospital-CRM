import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Loader2 } from 'lucide-react';
import Alert from '../common/Alert';
import api from '../../services/api';

const APPOINTMENT_TYPES = ['consultation', 'follow-up', 'checkup', 'treatment', 'procedure', 'other'];

const INITIAL_FORM_STATE = {
  patient: '',
  doctor: '',
  appointmentDate: '',
  startTime: '',
  endTime: '',
  type: 'consultation',
  reason: '',
  notes: '',
};

export default function AppointmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  appointment = null,
  isLoading = false,
  error = null,
  currentUser = null,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [prevAppointment, setPrevAppointment] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Fetch patients and doctors
  useEffect(() => {
    if (isOpen && (patients.length === 0 || doctors.length === 0)) {
      fetchSelectData();
    }
  }, [isOpen]);

  const fetchSelectData = async () => {
    try {
      setLoadingData(true);
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get('/patients', { params: { limit: 100 } }),
        api.get('/doctors', { params: { limit: 100 } }),
      ]);

      setPatients(patientsRes.data?.data || []);
      setDoctors(doctorsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch select data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  if (appointment !== prevAppointment || isOpen !== prevIsOpen) {
    setPrevAppointment(appointment);
    setPrevIsOpen(isOpen);
    setFormData(
      appointment
        ? {
            patient: appointment.patient?._id || '',
            doctor: appointment.doctor?._id || '',
            appointmentDate: appointment.appointmentDate?.split('T')[0] || '',
            startTime: appointment.startTime || '',
            endTime: appointment.endTime || '',
            type: appointment.type || 'consultation',
            reason: appointment.reason || '',
            notes: appointment.notes || '',
          }
        : { ...INITIAL_FORM_STATE },
    );
    setErrors({});
  }

  const validate = () => {
    const errs = {};
    if (!formData.patient) errs.patient = 'Patient is required.';
    if (!formData.doctor) errs.doctor = 'Doctor is required.';
    if (!formData.appointmentDate) errs.appointmentDate = 'Appointment date is required.';
    if (!formData.startTime) errs.startTime = 'Start time is required.';
    if (!formData.endTime) errs.endTime = 'End time is required.';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errs.endTime = 'End time must be after start time.';
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
      <button type="submit" form="appointment-form" disabled={isLoading} className="btn-primary">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Book Appointment'
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'Edit Appointment' : 'Book New Appointment'}
      size="2xl"
      footer={footer}
    >
      <form id="appointment-form" onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {error && <Alert type="error" message={error} dismissible={false} />}
        {loadingData && <p className="text-sm text-gray-500">Loading data...</p>}

        {/* Patient Selection */}
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
            className={`form-input ${errors.patient ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">-- Select patient --</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.firstName} {patient.lastName} ({patient.patientId})
              </option>
            ))}
          </select>
          {errors.patient && <p className="text-xs text-red-500 mt-1">{errors.patient}</p>}
        </div>

        {/* Doctor Selection */}
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
            className={`form-input ${errors.doctor ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">-- Select doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.userId?.firstName} {doctor.userId?.lastName} - {doctor.specialization}
              </option>
            ))}
          </select>
          {errors.doctor && <p className="text-xs text-red-500 mt-1">{errors.doctor}</p>}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label" htmlFor="appointmentDate">
              Date *
            </label>
            <input
              id="appointmentDate"
              name="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              className={`form-input ${errors.appointmentDate ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.appointmentDate && <p className="text-xs text-red-500 mt-1">{errors.appointmentDate}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="startTime">
              Start Time *
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              className={`form-input ${errors.startTime ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="endTime">
              End Time *
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              className={`form-input ${errors.endTime ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
          </div>
        </div>

        {/* Appointment Type */}
        <div>
          <label className="form-label" htmlFor="type">
            Appointment Type
          </label>
          <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="form-input">
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Reason for Appointment */}
        <div>
          <label className="form-label" htmlFor="reason">
            Reason for Appointment
          </label>
          <textarea
            id="reason"
            name="reason"
            maxLength="500"
            rows="3"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="What is the reason for this appointment?"
            className="form-input resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.reason.length} / 500 characters</p>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            maxLength="1000"
            rows="2"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes (for staff)"
            className="form-input resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.notes.length} / 1000 characters</p>
        </div>
      </form>
    </Modal>
  );
}
