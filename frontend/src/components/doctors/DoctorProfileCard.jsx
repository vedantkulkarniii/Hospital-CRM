import { MapPin, Phone, Mail, BookOpen, Award, Clock } from 'lucide-react';

export default function DoctorProfileCard({ doctor, showActions, onEdit, onDelete }) {
  if (!doctor) return null;

  return (
    <div className="card p-6">
      <div className="flex gap-6">
        {/* Doctor Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {doctor.userId?.firstName?.charAt(0)}
            {doctor.userId?.lastName?.charAt(0)}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
            </h3>
            <p className="text-primary-600 font-medium mt-1">{doctor.specialization}</p>
            {doctor.doctorId && <p className="text-xs text-gray-500 mt-1">ID: {doctor.doctorId}</p>}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {doctor.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm">{doctor.phone}</span>
              </div>
            )}
            {doctor.userId?.email && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm">{doctor.userId.email}</span>
              </div>
            )}
            {doctor.yearsOfExperience !== undefined && (
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm">{doctor.yearsOfExperience} years experience</span>
              </div>
            )}
            {doctor.consultationFee !== undefined && (
              <div className="flex items-center gap-2 text-gray-700">
                <Award size={16} className="text-gray-400" />
                <span className="text-sm font-medium">₹{doctor.consultationFee} per session</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {(doctor.department || doctor.officeAddress) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              {doctor.department && (
                <div className="text-sm">
                  <p className="text-gray-600 font-medium">Department</p>
                  <p className="text-gray-900">{doctor.department}</p>
                </div>
              )}
              {doctor.officeAddress && (
                <div className="flex gap-2 text-sm">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600 font-medium">Office Address</p>
                    <p className="text-gray-900">{doctor.officeAddress}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex flex-col gap-2 items-end">
          {doctor.isVerified && (
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
              Verified
            </div>
          )}
          {!doctor.isVerified && (
            <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200">
              Pending Verification
            </div>
          )}
          {doctor.isActive && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
              Active
            </div>
          )}
          {!doctor.isActive && (
            <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
              Inactive
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {doctor.bio && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{doctor.bio}</p>
        </div>
      )}

      {/* Qualifications */}
      {doctor.qualifications && doctor.qualifications.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-primary-600" />
            <h4 className="font-medium text-gray-900">Qualifications</h4>
          </div>
          <div className="space-y-2">
            {doctor.qualifications.map((qual, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                <span className="font-medium">{qual.degree}</span>
                {qual.institution && <span> from {qual.institution}</span>}
                {qual.yearObtained && <span> ({qual.yearObtained})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
          {onEdit && (
            <button onClick={onEdit} className="btn-secondary flex-1">
              Edit Profile
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="btn-secondary text-red-600 hover:bg-red-50 flex-1">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
