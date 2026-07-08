import { Calendar, Clock, User, Stethoscope, MapPin, Phone, Mail, DollarSign, FileText } from 'lucide-react';

export default function AppointmentDetailView({ appointment, onEdit, onCancel, isStaff }) {
  if (!appointment) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{appointment.appointmentId}</h2>
          <p className="text-gray-600 mt-1">
            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
              {appointment.patient?.firstName} {appointment.patient?.lastName}
            </p>
            <p className="text-sm text-gray-600">{appointment.patient?.patientId}</p>
            {appointment.patient?.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Mail size={14} />
                {appointment.patient.email}
              </div>
            )}
            {appointment.patient?.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                {appointment.patient.phone}
              </div>
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
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </p>
            <p className="text-sm text-gray-600">{appointment.doctor?.specialization}</p>
            <p className="text-sm text-gray-600">{appointment.doctor?.doctorId}</p>
          </div>
        </div>
      </div>

      {/* Time Details */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-orange-600" />
          <h3 className="font-bold text-gray-900">Time Details</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(appointment.appointmentDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Start Time</p>
            <p className="text-sm font-semibold text-gray-900">{appointment.startTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">End Time</p>
            <p className="text-sm font-semibold text-gray-900">{appointment.endTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Duration</p>
            <p className="text-sm font-semibold text-gray-900">{appointment.durationMinutes} mins</p>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-purple-600" />
          <h3 className="font-bold text-gray-900">Appointment Details</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
            <p className="text-sm text-gray-900 mt-1">{appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</p>
          </div>
          {appointment.reason && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Reason</p>
              <p className="text-sm text-gray-900 mt-1">{appointment.reason}</p>
            </div>
          )}
          {appointment.notes && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Notes</p>
              <p className="text-sm text-gray-900 mt-1">{appointment.notes}</p>
            </div>
          )}
          {appointment.consultationFee && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">Consultation Fee:</span>
              <span className="text-lg font-bold text-gray-900">₹{appointment.consultationFee}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {isStaff && (
        <div className="flex gap-3">
          {appointment.status !== 'cancelled' && (
            <>
              <button onClick={onEdit} className="btn-primary flex-1">
                Edit Appointment
              </button>
              {appointment.status === 'scheduled' && (
                <button onClick={onCancel} className="btn-secondary text-red-600 hover:bg-red-50 flex-1">
                  Cancel Appointment
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
