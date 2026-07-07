import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit2, Trash2, Calendar, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import {
  setLoading,
  setAppointments,
  setPagination,
  setSelectedAppointment,
  setError,
  clearError,
  selectAppointments,
  selectAppointmentsLoading,
  selectAppointmentsError,
  selectAppointmentsPagination,
} from '../../store/slices/appointmentSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
import Alert from '../../components/common/Alert';

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointments);
  const isLoading = useSelector(selectAppointmentsLoading);
  const error = useSelector(selectAppointmentsError);
  const pagination = useSelector(selectAppointmentsPagination);
  const currentUser = useSelector(selectCurrentUser);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await appointmentService.getAppointments({ page, limit, search, status });
      const data = response.data || [];
      const meta = response.meta || { total: data.length, page, limit, totalPages: 1 };
      dispatch(setAppointments(data));
      dispatch(setPagination(meta));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch appointments.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, page, limit, search, status]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAppointments();
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await appointmentService.cancelAppointment(id, { cancellationReason: 'Cancelled by user' });
      fetchAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel appointment.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await appointmentService.deleteAppointment(id);
      fetchAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete appointment.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);
      setFormSubmitError(null);
      if (editingAppointment) {
        await appointmentService.updateAppointment(editingAppointment._id, data);
      } else {
        await appointmentService.createAppointment(data);
      }
      setIsFormOpen(false);
      fetchAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save appointment.';
      setFormSubmitError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser && ['admin', 'receptionist', 'doctor'].includes(currentUser.role);
  const isPatient = currentUser?.role === 'patient';

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and schedule patient appointments with doctors.</p>
        </div>
        {(isStaff || isPatient) && (
          <button onClick={handleAddAppointment} className="btn-primary self-start md:self-auto">
            <Plus size={18} />
            Book Appointment
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => dispatch(clearError())} />}

      <div className="card">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="relative">
            <label className="form-label">Search Appointments</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by appointment ID or reason..."
                className="form-input pl-10"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </form>
      </div>

      {isLoading && appointments.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-2" />
          <span className="text-sm text-gray-500">Loading appointments...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Appointments Found</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            No appointments match your current filters. Book an appointment to get started.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Appointment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  {isStaff && (
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                      {appointment.appointmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{appointment.patient?.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{appointment.doctor?.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {appointment.startTime} – {appointment.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    {isStaff && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {appointment.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => handleEditAppointment(appointment)}
                                className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                                title="Edit Appointment"
                              >
                                <Edit2 size={16} />
                              </button>
                              {appointment.status === 'scheduled' && (
                                <button
                                  onClick={() => handleCancelAppointment(appointment._id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition"
                                  title="Cancel Appointment"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteAppointment(appointment._id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition"
                              title="Delete Appointment"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <AppointmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        appointment={editingAppointment}
        isLoading={formLoading}
        error={formSubmitError}
        currentUser={currentUser}
      />
    </div>
  );
}
