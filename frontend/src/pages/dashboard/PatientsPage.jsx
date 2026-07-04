import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit2, Trash2, Eye, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import patientService from '../../services/patientService';
import {
  setLoading,
  setPatients,
  setPagination,
  setSelectedPatient,
  setError,
  clearError,
  selectPatients,
  selectSelectedPatient,
  selectPatientsLoading,
  selectPatientsError,
  selectPatientsPagination,
} from '../../store/slices/patientSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import PatientFormModal from '../../components/patients/PatientFormModal';
import PatientDetailModal from '../../components/patients/PatientDetailModal';
import Alert from '../../components/common/Alert';

export default function PatientsPage() {
  const dispatch = useDispatch();
  const patients = useSelector(selectPatients);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isLoading = useSelector(selectPatientsLoading);
  const error = useSelector(selectPatientsError);
  const pagination = useSelector(selectPatientsPagination);
  const currentUser = useSelector(selectCurrentUser);

  // Filters state
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch patients list
  const fetchPatients = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await patientService.getPatients({
        page,
        limit,
        search,
        gender,
        bloodGroup,
      });
      // Extract data
      const data = response.data || [];
      const meta = response.meta || { total: data.length, page, limit, totalPages: 1 };
      dispatch(setPatients(data));
      dispatch(setPagination(meta));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch patients list.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, page, limit, search, gender, bloodGroup]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients();
  };

  // Open Form modal for creation
  const handleAddPatient = () => {
    setEditingPatient(null);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  // Open Form modal for editing
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  // Open Details modal
  const handleViewPatient = (patient) => {
    dispatch(setSelectedPatient(patient));
    setIsDetailOpen(true);
  };

  // Handle delete action
  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await patientService.deletePatient(id);
      fetchPatients();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete patient.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle Form modal submit (Create or Update)
  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);
      setFormSubmitError(null);
      if (editingPatient) {
        // Update
        await patientService.updatePatient(editingPatient._id, data);
      } else {
        // Create
        await patientService.createPatient(data);
      }
      setIsFormOpen(false);
      fetchPatients();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save patient record.';
      setFormSubmitError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isMedicalStaff = currentUser && ['admin', 'doctor', 'receptionist'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage and track all patients in the system.</p>
        </div>
        {isMedicalStaff && (
          <button onClick={handleAddPatient} className="btn-primary self-start md:self-auto">
            <Plus size={18} />
            Add Patient
          </button>
        )}
      </div>

      {/* Main Error */}
      {error && <Alert type="error" message={error} onDismiss={() => dispatch(clearError())} />}

      {/* Filters and Search Bar */}
      <div className="card">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <label className="form-label">Search Patients</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, Name, Phone or Email..."
                className="form-input pl-10"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="form-label">Gender</label>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
              className="form-input"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <div>
            <label className="form-label">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => {
                setBloodGroup(e.target.value);
                setPage(1);
              }}
              className="form-input"
            >
              <option value="">All Blood Groups</option>
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
        </form>
      </div>

      {/* Patients Table */}
      {isLoading && patients.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-2" />
          <span className="text-sm text-gray-500">Loading patients data...</span>
        </div>
      ) : patients.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Patients Found</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            We couldn't find any patients matching your search criteria. Try modifying your filters or create a new patient profile.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender / Age</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50/50 transition">
                    {/* Patient ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                      {patient.patientId}
                    </td>
                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </td>
                    {/* Gender / Age */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="capitalize">{patient.gender}</span>
                      <span className="text-gray-400 mx-1.5">•</span>
                      <span>{patient.age || 'N/A'} yrs</span>
                    </td>
                    {/* Contact info */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{patient.phone}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{patient.email || 'No Email'}</div>
                    </td>
                    {/* Blood Group */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="badge badge-success">{patient.bloodGroup || 'unknown'}</span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {isMedicalStaff && (
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            title="Edit Record"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeletePatient(patient._id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition"
                            title="Delete Record"
                          >
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

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing Page <span className="font-semibold text-gray-900">{pagination.page}</span> of{' '}
                <span className="font-semibold text-gray-900">{pagination.totalPages}</span> ({pagination.total} records)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1 || isLoading}
                  className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages || isLoading}
                  className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <PatientFormModal
        key={editingPatient?._id || 'new'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        patient={editingPatient}
        isLoading={formLoading}
        error={formSubmitError}
      />

      {/* Details Modal */}
      <PatientDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
}
