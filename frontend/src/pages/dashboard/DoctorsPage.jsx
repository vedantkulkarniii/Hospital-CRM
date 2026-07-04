import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit2, Trash2, Stethoscope, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import doctorService from '../../services/doctorService';
import {
  setLoading,
  setDoctors,
  setPagination,
  setSelectedDoctor,
  setError,
  clearError,
  selectDoctors,
  selectDoctorsLoading,
  selectDoctorsError,
  selectDoctorsPagination,
} from '../../store/slices/doctorSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import DoctorFormModal from '../../components/doctors/DoctorFormModal';
import Alert from '../../components/common/Alert';

export default function DoctorsPage() {
  const dispatch = useDispatch();
  const doctors = useSelector(selectDoctors);
  const isLoading = useSelector(selectDoctorsLoading);
  const error = useSelector(selectDoctorsError);
  const pagination = useSelector(selectDoctorsPagination);
  const currentUser = useSelector(selectCurrentUser);

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await doctorService.getDoctors({ page, limit, search, specialization });
      const data = response.data || [];
      const meta = response.meta || { total: data.length, page, limit, totalPages: 1 };
      dispatch(setDoctors(data));
      dispatch(setPagination(meta));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch doctors list.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, page, limit, search, specialization]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor record?')) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await doctorService.deleteDoctor(id);
      fetchDoctors();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete doctor.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);
      setFormSubmitError(null);
      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor._id, data);
      } else {
        await doctorService.createDoctor(data);
      }
      setIsFormOpen(false);
      fetchDoctors();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save doctor record.';
      setFormSubmitError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isStaff = currentUser && ['admin', 'receptionist'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">Manage doctor profiles, specializations, and consultations.</p>
        </div>
        {isStaff && (
          <button onClick={handleAddDoctor} className="btn-primary self-start md:self-auto">
            <Plus size={18} />
            Add Doctor
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => dispatch(clearError())} />}

      <div className="card">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="relative">
            <label className="form-label">Search Doctors</label>
            <div className="relative">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, specialization or phone..." className="form-input pl-10" />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label className="form-label">Specialization</label>
            <input type="text" value={specialization} onChange={(e) => { setSpecialization(e.target.value); setPage(1); }} placeholder="e.g. Cardiology" className="form-input" />
          </div>
        </form>
      </div>

      {isLoading && doctors.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-2" />
          <span className="text-sm text-gray-500">Loading doctors data...</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Stethoscope size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Doctors Found</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">No doctor records match your current filters. Add a doctor profile to get started.</p>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Doctor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">{doctor.doctorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{doctor.phone}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{doctor.email || 'No Email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.availability || 'Available'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {isStaff && (
                          <button onClick={() => handleEditDoctor(doctor)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition" title="Edit Record">
                            <Edit2 size={16} />
                          </button>
                        )}
                        {isAdmin && (
                          <button onClick={() => handleDeleteDoctor(doctor._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition" title="Delete Record">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <DoctorFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} doctor={editingDoctor} isLoading={formLoading} error={formSubmitError} />
    </div>
  );
}
