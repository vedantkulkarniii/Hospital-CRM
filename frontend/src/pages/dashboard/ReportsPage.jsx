import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart3,
  TrendingUp,
  Users,
  Stethoscope,
  DollarSign,
  Calendar,
  Download,
  Loader,
} from 'lucide-react';
import analyticsService from '../../services/analyticsService.js';
import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  setDateRange,
} from '../../store/slices/analyticsSlice.js';
import Alert from '../../components/common/Alert.jsx';

export default function ReportsPage() {
  const dispatch = useDispatch();
  const { dashboard, loading, error, dateRange } = useSelector((state) => state.analytics);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      dispatch(fetchDashboardStart());
      const response = await analyticsService.getDashboardAnalytics({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      dispatch(fetchDashboardSuccess(response.data));
    } catch (err) {
      dispatch(fetchDashboardFailure(err.response?.data?.message || 'Failed to fetch analytics'));
    }
  };

  const handleDateRangeChange = () => {
    fetchDashboard();
  };

  const handleDownloadReport = (format = 'json') => {
    const reportData = JSON.stringify(dashboard, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(reportData)}`);
    element.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.${format}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive system analytics and performance metrics</p>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} />}

      {/* Date Range Filter */}
      <div className="card">
        <div className="flex gap-4 flex-wrap items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button onClick={handleDateRangeChange} className="btn-primary">
            Update
          </button>
          <button onClick={() => handleDownloadReport('json')} className="btn-secondary flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {dashboard && (
        <>
          {/* Financial Summary */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={24} className="text-green-600" />
              Financial Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Billed</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{dashboard.financialSummary?.billing?.totalBilled?.toFixed(0) || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{dashboard.financialSummary?.billing?.totalPaid?.toFixed(0) || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ₹{dashboard.financialSummary?.billing?.totalPending?.toFixed(0) || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboard.billingRevenue?.collectionRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Patient Analytics */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={24} className="text-blue-600" />
              Patient Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.patientDemographics?.totalPatients || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">New Patients (30 days)</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboard.patientDemographics?.newPatients || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">By Gender</p>
                <div className="text-sm">
                  {dashboard.patientDemographics?.byGender?.map((g) => (
                    <p key={g._id} className="text-gray-700">
                      {g._id}: {g.count}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Analytics */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-purple-600" />
              Appointment Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.appointmentAnalytics?.totalAppointments || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboard.appointmentAnalytics?.completionRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Cancellation Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboard.appointmentAnalytics?.cancellationRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">By Status</p>
                <div className="text-xs">
                  {dashboard.appointmentAnalytics?.byStatus?.slice(0, 2).map((s) => (
                    <p key={s._id} className="text-gray-700">
                      {s._id}: {s.count}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Performance */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope size={24} className="text-green-600" />
              Doctor Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.doctorPerformance?.totalDoctors || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Completed Appointments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboard.doctorPerformance?.completedAppointments || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboard.doctorPerformance?.averageRating?.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboard.occupancyRate?.occupancyRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Prescription Trends */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-orange-600" />
              Prescription Trends
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.prescriptionTrends?.totalPrescriptions || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Active Prescriptions</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboard.prescriptionTrends?.activePrescriptions || 0}
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-600 mb-1">Top Medications</p>
                <div className="text-xs">
                  {dashboard.prescriptionTrends?.topMedications?.slice(0, 2).map((m) => (
                    <p key={m._id} className="text-gray-700">
                      {m._id}: {m.count}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trends */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue Trends</h2>
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-semibold text-gray-700">Month</th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-700">Revenue</th>
                      <th className="text-right py-2 px-4 font-semibold text-gray-700">Bills Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.billingRevenue?.monthlyRevenue?.map((month) => (
                      <tr key={month._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-4">{month._id}</td>
                        <td className="text-right py-2 px-4 font-medium">₹{month.revenue?.toFixed(0) || 0}</td>
                        <td className="text-right py-2 px-4">{month.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
