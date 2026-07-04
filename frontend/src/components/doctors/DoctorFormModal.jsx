import { useState } from 'react';
import Modal from '../common/Modal';
import { Loader2 } from 'lucide-react';
import Alert from '../common/Alert';

const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  specialization: '',
  qualification: '',
  experience: 0,
  consultationFee: 0,
  phone: '',
  email: '',
  availability: 'Available',
};

export default function DoctorFormModal({ isOpen, onClose, onSubmit, doctor = null, isLoading = false, error = null }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [prevDoctor, setPrevDoctor] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (doctor !== prevDoctor || isOpen !== prevIsOpen) {
    setPrevDoctor(doctor);
    setPrevIsOpen(isOpen);
    setFormData(
      doctor
        ? {
            firstName: doctor.firstName || '',
            lastName: doctor.lastName || '',
            specialization: doctor.specialization || '',
            qualification: doctor.qualification || '',
            experience: doctor.experience || 0,
            consultationFee: doctor.consultationFee || 0,
            phone: doctor.phone || '',
            email: doctor.email || '',
            availability: doctor.availability || 'Available',
          }
        : INITIAL_FORM_STATE,
    );
    setErrors({});
  }

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.specialization.trim()) errs.specialization = 'Specialization is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      errs.phone = 'Please provide a valid phone number.';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
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

    onSubmit({
      ...formData,
      experience: Number(formData.experience) || 0,
      consultationFee: Number(formData.consultationFee) || 0,
    });
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} disabled={isLoading} className="btn-secondary">
        Cancel
      </button>
      <button type="submit" form="doctor-form" disabled={isLoading} className="btn-primary">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Doctor'
        )}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doctor ? 'Edit Doctor Record' : 'Add New Doctor'} size="2xl" footer={footer}>
      <form id="doctor-form" onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {error && <Alert type="error" message={error} dismissible={false} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="firstName">First Name *</label>
            <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className={`form-input ${errors.firstName ? 'border-red-400 focus:ring-red-400' : ''}`} />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="lastName">Last Name *</label>
            <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className={`form-input ${errors.lastName ? 'border-red-400 focus:ring-red-400' : ''}`} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="specialization">Specialization *</label>
            <input id="specialization" name="specialization" type="text" value={formData.specialization} onChange={handleInputChange} className={`form-input ${errors.specialization ? 'border-red-400 focus:ring-red-400' : ''}`} />
            {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="qualification">Qualification</label>
            <input id="qualification" name="qualification" type="text" value={formData.qualification} onChange={handleInputChange} className="form-input" />
          </div>
          <div>
            <label className="form-label" htmlFor="experience">Experience (years)</label>
            <input id="experience" name="experience" type="number" min="0" value={formData.experience} onChange={handleInputChange} className="form-input" />
          </div>
          <div>
            <label className="form-label" htmlFor="consultationFee">Consultation Fee</label>
            <input id="consultationFee" name="consultationFee" type="number" min="0" value={formData.consultationFee} onChange={handleInputChange} className="form-input" />
          </div>
          <div>
            <label className="form-label" htmlFor="phone">Phone Number *</label>
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={`form-input ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={`form-input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="availability">Availability</label>
            <input id="availability" name="availability" type="text" value={formData.availability} onChange={handleInputChange} className="form-input" />
          </div>
        </div>
      </form>
    </Modal>
  );
}
