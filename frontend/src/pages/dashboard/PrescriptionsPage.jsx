import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Edit2, Trash2, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import prescriptionService from '../../services/prescriptionService';
import {
  setLoading,
  setPrescriptions,
  setPagination,
  setSelectedPrescription,
  setError,
  clearError,
  selectPrescriptions,
  selectPrescriptionsLoading,
  selectPrescriptionsError,
  selectPrescriptionsPagination,
} from '../../store/slices/prescriptionSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import PrescriptionFormModal from '../../components/prescriptions/PrescriptionFormModal';
import Alert from '../../components/common/Alert';

export default function PrescriptionsPage() {
  const dispatch = useDispatch();
  const prescriptions = useSelector(selectPrescriptions);
  const isLoading = useSelector(selectPrescriptionsLoading);
  const error = useSelector(selectPrescriptionsError);
  const pagination = useSelector(selectPrescriptionsPagination);
  const currentUser = useSelector(selectCurrentUser);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await prescriptionService.getPrescriptions({ page, limit, search });
      const data = response.data || [];
      const meta = response.meta || { total: data.length, page, limit, totalPages: 1 };
      dispatch(setPrescriptions(data));
      dispatch(setPagination(meta));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch prescriptions.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPrescriptions();
  };

  const handleAddPrescription = () => {
    setEditingPrescription(null);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setFormSubmitError(null);
    setIsFormOpen(true);
  };

  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) {
      return;
    }
    try {
      dispatch(setLoading(true));
      await prescriptionService.deletePrescription(id);
      fetchPrescriptions();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete prescription.';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);
      setFormSubmitError(null);
      if (editingPrescription) {
        await prescriptionService.updatePrescription(editingPrescription._id, data);
      } else {
        await prescriptionService.createPrescription(data);
      }
      setIsFormOpen(false);
      fetchPrescriptions();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save prescription.';
      setFormSubmitError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const isDoctor = currentUser?.role === 'doctor';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Manage and create patient prescriptions.</p>
        </div>
        {isDoctor && (
          <button onClick={handleAddPrescription} className="btn-primary self-start md:self-auto">
            <Plus size={18} />
            Create Prescription
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => dispatch(clearError())} />}

      <div className="card">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <label className="form-label">Search Prescriptions</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by prescription ID or diagnosis..."
                className="form-input pl-10 w-full"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>
      </div>

      {isLoading && prescriptions.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-2" />
          <span className="text-sm text-gray-500">Loading prescriptions...</span>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Prescriptions Found</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            No prescriptions match your search. Create a new prescription to get started.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    RX ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Medications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  {(isDoctor || isAdmin) && (
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {prescriptions.map((prescription) => (
                  <tr key={prescription._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                      {prescription.prescriptionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {prescription.patient?.firstName} {prescription.patient?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 truncate">{prescription.diagnosis}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{prescription.medications?.length || 0} meds</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </td>
                    {(isDoctor || isAdmin) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditPrescription(prescription)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            title="Edit Prescription"
                          >
                            <Edit2 size={16} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeletePrescription(prescription._id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition"
                              title="Delete Prescription"
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

      <PrescriptionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        prescription={editingPrescription}
        isLoading={formLoading}
        error={formSubmitError}
        currentUser={currentUser}
      />
    </div>
  );
}
