import Modal from '../common/Modal';
import { Phone, Mail, MapPin, ShieldAlert, User, Clock } from 'lucide-react';

export default function PatientDetailModal({ isOpen, onClose, patient }) {
  if (!patient) return null;

  const formattedDOB = patient.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const formattedCreatedAt = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const footer = (
    <button type="button" onClick={onClose} className="btn-primary">
      Close
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Patient File: ${patient.firstName} ${patient.lastName}`}
      size="lg"
      footer={footer}
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {/* Header Summary */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xl font-bold">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-primary">{patient.patientId || 'N/A'}</span>
              <span className={`badge ${patient.gender === 'male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
              </span>
              <span className="badge badge-gray">Age: {patient.age || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <User size={18} className="text-primary-600" />
              General Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date of Birth:</span>
                <span className="font-medium text-gray-900">{formattedDOB}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Group:</span>
                <span className="font-medium text-gray-900 badge badge-success">{patient.bloodGroup || 'unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Allergies:</span>
                <span className="font-medium text-gray-900">
                  {Array.isArray(patient.allergies) && patient.allergies.length > 0
                    ? patient.allergies.join(', ')
                    : 'None reported'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Phone size={18} className="text-primary-600" />
              Contact Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-gray-400" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-gray-400" />
                <span>{patient.email || 'No email registered'}</span>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" />
              Address Details
            </h4>
            <div className="text-sm text-gray-700">
              {patient.address?.street ? (
                <p>
                  {patient.address.street}, {patient.address.city}, {patient.address.state} — {patient.address.postalCode}, {patient.address.country}
                </p>
              ) : (
                <p className="text-gray-500 italic">No address registered</p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <ShieldAlert size={18} className="text-danger-600" />
              Emergency Contact
            </h4>
            {patient.emergencyContact?.name ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-red-50/50 p-3 rounded-lg border border-red-100">
                <div>
                  <span className="text-gray-500 block">Name</span>
                  <span className="font-medium text-gray-900">{patient.emergencyContact.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Relationship</span>
                  <span className="font-medium text-gray-900">{patient.emergencyContact.relationship || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone</span>
                  <span className="font-medium text-gray-900">{patient.emergencyContact.phone || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No emergency contact registered</p>
            )}
          </div>

          {/* Medical History */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
              <ShieldAlert size={18} className="text-primary-600" />
              Medical History
            </h4>
            {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0 ? (
              <div className="space-y-3">
                {patient.medicalHistory.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">{item.condition}</span>
                      <span className={`badge ${item.isOngoing ? 'badge-danger' : 'badge-success'}`}>
                        {item.isOngoing ? 'Ongoing' : 'Resolved'}
                      </span>
                    </div>
                    {item.diagnosedAt && (
                      <p className="text-xs text-gray-500 mb-1">
                        Diagnosed: {new Date(item.diagnosedAt).toLocaleDateString()}
                      </p>
                    )}
                    {item.notes && <p className="text-gray-600 text-xs mt-1">{item.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No historical conditions recorded</p>
            )}
          </div>

          {/* Audit Info */}
          <div className="space-y-4 md:col-span-2 text-xs text-gray-400 border-t pt-4 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Created: {formattedCreatedAt}</span>
            </div>
            {patient.createdBy && (
              <div>
                <span>Added by: {patient.createdBy.firstName} {patient.createdBy.lastName} ({patient.createdBy.role})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
