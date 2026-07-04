import { useState } from 'react';
import Modal from '../common/Modal';
import { Loader2 } from 'lucide-react';
import Alert from '../common/Alert';

const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'male',
  phone: '',
  email: '',
  bloodGroup: 'unknown',
  allergies: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
};

export default function PatientFormModal({ isOpen, onClose, onSubmit, patient = null, isLoading = false, error = null }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [prevPatient, setPrevPatient] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Sync state during render when props change
  if (patient !== prevPatient || isOpen !== prevIsOpen) {
    setPrevPatient(patient);
    setPrevIsOpen(isOpen);
    setFormData(
      patient
        ? {
            firstName: patient.firstName || '',
            lastName: patient.lastName || '',
            dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
            gender: patient.gender || 'male',
            phone: patient.phone || '',
            email: patient.email || '',
            bloodGroup: patient.bloodGroup || 'unknown',
            allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
            address: {
              street: patient.address?.street || '',
              city: patient.address?.city || '',
              state: patient.address?.state || '',
              postalCode: patient.address?.postalCode || '',
              country: patient.address?.country || 'India',
            },
            emergencyContact: {
              name: patient.emergencyContact?.name || '',
              relationship: patient.emergencyContact?.relationship || '',
              phone: patient.emergencyContact?.phone || '',
            },
          }
        : INITIAL_FORM_STATE
    );
    setErrors({});
  }

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required.';
    if (!formData.gender) errs.gender = 'Gender is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      errs.phone = 'Please provide a valid phone number (7 to 20 digits).';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (formData.emergencyContact?.phone && !/^[0-9+\-\s()]{7,20}$/.test(formData.emergencyContact.phone)) {
      errs.emergencyContactPhone = 'Please provide a valid emergency phone number.';
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

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (section === 'emergencyContact' && field === 'phone' && errors.emergencyContactPhone) {
      setErrors((prev) => ({ ...prev, emergencyContactPhone: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    // Process allergies: string to array of clean strings
    const cleanAllergies = formData.allergies
      ? formData.allergies.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    onSubmit({
      ...formData,
      allergies: cleanAllergies,
    });
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="btn-secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="patient-form"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Patient'
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? 'Edit Patient Record' : 'Add New Patient'}
      size="2xl"
      footer={footer}
    >
      <form id="patient-form" onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {error && <Alert type="error" message={error} dismissible={false} />}
        
        {/* Personal Details */}
        <div>
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input ${errors.firstName ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input ${errors.lastName ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`form-input ${errors.dateOfBirth ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="e.g. +91 9876543210"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="e.g. patient@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div>
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">Medical Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="unknown">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="allergies">Allergies (comma-separated)</label>
              <input
                id="allergies"
                name="allergies"
                type="text"
                value={formData.allergies}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Peanuts, Penicillin, Dust"
              />
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label" htmlFor="street">Street Address</label>
              <input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={formData.address.city}
                onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                value={formData.address.state}
                onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="postalCode">Postal Code / ZIP</label>
              <input
                id="postalCode"
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => handleNestedChange('address', 'postalCode', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                value={formData.address.country}
                onChange={(e) => handleNestedChange('address', 'country', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label" htmlFor="emergencyName">Contact Name</label>
              <input
                id="emergencyName"
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="emergencyRelationship">Relationship</label>
              <input
                id="emergencyRelationship"
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                className="form-input"
                placeholder="e.g. Spouse, Parent"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="emergencyPhone">Phone Number</label>
              <input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                className={`form-input ${errors.emergencyContactPhone ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.emergencyContactPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyContactPhone}</p>}
            </div>
          </div>
        </div>

      </form>
    </Modal>
  );
}
