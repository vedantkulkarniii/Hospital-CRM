import { useState } from 'react';
import Modal from '../common/Modal';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Alert from '../common/Alert';

const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Surgery',
  'Ophthalmology',
  'ENT',
  'Gastroenterology',
  'Pulmonology',
  'Oncology',
  'Nephrology',
  'Rheumatology',
  'Urology',
  'Other',
];

const INITIAL_FORM_STATE = {
  userId: '',
  specialization: '',
  qualifications: [{ degree: '', institution: '', yearObtained: new Date().getFullYear(), certificateNumber: '' }],
  yearsOfExperience: 0,
  licenseNumber: '',
  phone: '',
  consultationFee: 0,
  bio: '',
  department: '',
  officeAddress: '',
  availability: [],
};

export default function DoctorFormModal({ isOpen, onClose, onSubmit, doctor = null, isLoading = false, error = null, users = [] }) {
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
            userId: doctor.userId?._id || '',
            specialization: doctor.specialization || '',
            qualifications: doctor.qualifications || [{ degree: '', institution: '', yearObtained: new Date().getFullYear(), certificateNumber: '' }],
            yearsOfExperience: doctor.yearsOfExperience || 0,
            licenseNumber: doctor.licenseNumber || '',
            phone: doctor.phone || '',
            consultationFee: doctor.consultationFee || 0,
            bio: doctor.bio || '',
            department: doctor.department || '',
            officeAddress: doctor.officeAddress || '',
            availability: doctor.availability || [],
          }
        : INITIAL_FORM_STATE,
    );
    setErrors({});
  }

  const validate = () => {
    const errs = {};
    if (!formData.userId) errs.userId = 'User is required.';
    if (!formData.specialization.trim()) errs.specialization = 'Specialization is required.';
    if (!formData.licenseNumber.trim()) errs.licenseNumber = 'License number is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      errs.phone = 'Please provide a valid phone number.';
    }
    if (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 80) {
      errs.yearsOfExperience = 'Years of experience must be between 0 and 80.';
    }
    if (formData.consultationFee < 0) {
      errs.consultationFee = 'Consultation fee must be a non-negative number.';
    }
    if (!formData.qualifications || formData.qualifications.length === 0) {
      errs.qualifications = 'At least one qualification is required.';
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

  const handleQualificationChange = (index, field, value) => {
    const newQualifications = [...formData.qualifications];
    newQualifications[index] = { ...newQualifications[index], [field]: value };
    setFormData((prev) => ({ ...prev, qualifications: newQualifications }));
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { degree: '', institution: '', yearObtained: new Date().getFullYear(), certificateNumber: '' },
      ],
    }));
  };

  const removeQualification = (index) => {
    if (formData.qualifications.length > 1) {
      setFormData((prev) => ({
        ...prev,
        qualifications: prev.qualifications.filter((_, i) => i !== index),
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

    onSubmit({
      ...formData,
      yearsOfExperience: Number(formData.yearsOfExperience) || 0,
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
    <Modal isOpen={isOpen} onClose={onClose} title={doctor ? 'Edit Doctor Profile' : 'Add New Doctor'} size="2xl" footer={footer}>
      <form id="doctor-form" onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {error && <Alert type="error" message={error} dismissible={false} />}

        {/* User Selection */}
        <div>
          <label className="form-label" htmlFor="userId">
            Select User *
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className={`form-input ${errors.userId ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">-- Select a user --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
          {errors.userId && <p className="text-xs text-red-500 mt-1">{errors.userId}</p>}
        </div>

        {/* Specialization */}
        <div>
          <label className="form-label" htmlFor="specialization">
            Specialization *
          </label>
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className={`form-input ${errors.specialization ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">-- Select specialization --</option>
            {SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization}</p>}
        </div>

        {/* Qualifications */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="form-label">Qualifications *</label>
            {errors.qualifications && <p className="text-xs text-red-500">{errors.qualifications}</p>}
          </div>
          {formData.qualifications.map((qual, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Degree *</label>
                  <input
                    type="text"
                    placeholder="e.g., MBBS, MD, MS"
                    value={qual.degree}
                    onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Institution</label>
                  <input
                    type="text"
                    placeholder="e.g., Medical College"
                    value={qual.institution}
                    onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Year Obtained *</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={qual.yearObtained}
                    onChange={(e) => handleQualificationChange(index, 'yearObtained', parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Certificate Number</label>
                  <input
                    type="text"
                    placeholder="Certificate number (optional)"
                    value={qual.certificateNumber}
                    onChange={(e) => handleQualificationChange(index, 'certificateNumber', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              {formData.qualifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQualification(index)}
                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Remove Qualification
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addQualification}
            className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
          >
            <Plus size={14} />
            Add Another Qualification
          </button>
        </div>

        {/* Years of Experience & License */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="yearsOfExperience">
              Years of Experience *
            </label>
            <input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="number"
              min="0"
              max="80"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              className={`form-input ${errors.yearsOfExperience ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.yearsOfExperience && <p className="text-xs text-red-500 mt-1">{errors.yearsOfExperience}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="licenseNumber">
              License Number *
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className={`form-input ${errors.licenseNumber ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber}</p>}
          </div>
        </div>

        {/* Phone & Consultation Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="phone">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="consultationFee">
              Consultation Fee *
            </label>
            <input
              id="consultationFee"
              name="consultationFee"
              type="number"
              min="0"
              value={formData.consultationFee}
              onChange={handleInputChange}
              className={`form-input ${errors.consultationFee ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.consultationFee && <p className="text-xs text-red-500 mt-1">{errors.consultationFee}</p>}
          </div>
        </div>

        {/* Bio, Department & Office Address */}
        <div>
          <label className="form-label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            maxLength="1000"
            rows="3"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Brief bio about the doctor"
            className="form-input resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.bio.length} / 1000 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="department">
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Cardiology Department"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="officeAddress">
              Office Address
            </label>
            <input
              id="officeAddress"
              name="officeAddress"
              type="text"
              value={formData.officeAddress}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Clinic or office address"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

