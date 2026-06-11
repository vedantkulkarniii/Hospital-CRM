import { Zap, Users, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import AppointmentTrendChart from '../../components/charts/AppointmentTrendChart';
import AppointmentStatusChart from '../../components/charts/AppointmentStatusChart';

export default function DashboardPage() {
  // Placeholder stats - will be populated from API
  const stats = [
    { label: 'Total Patients', value: '245', icon: Users, color: 'blue' },
    { label: 'Appointments Today', value: '12', icon: Calendar, color: 'green' },
    { label: 'Doctors Available', value: '8', icon: Zap, color: 'purple' },
    { label: 'Revenue (This Month)', value: '$12,450', icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening in your hospital today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentTrendChart />
        <AppointmentStatusChart />
      </div>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments Widget */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Appointments</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">Consultation - 10:30 AM</p>
              </div>
              <span className="badge-success">Confirmed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Jane Smith</p>
                <p className="text-sm text-gray-500">Check-up - 11:00 AM</p>
              </div>
              <span className="badge-primary">Scheduled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mike Johnson</p>
                <p className="text-sm text-gray-500">Follow-up - 2:00 PM</p>
              </div>
              <span className="badge-warning">Pending</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Widget */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn-primary w-full justify-center">New Appointment</button>
            <button className="btn-secondary w-full justify-center">Add Patient</button>
            <button className="btn-secondary w-full justify-center">View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
}
