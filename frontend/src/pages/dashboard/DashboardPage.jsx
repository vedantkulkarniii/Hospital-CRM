import { useState, useEffect } from 'react';
import { Zap, Users, Calendar, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import StatsCard from '../../components/dashboard/StatsCard';
import AppointmentTrendChart from '../../components/charts/AppointmentTrendChart';
import AppointmentStatusChart from '../../components/charts/AppointmentStatusChart';
import SkeletonCard from '../../components/common/SkeletonCard';
import SkeletonChart from '../../components/common/SkeletonChart';
import { useDashboard } from '../../hooks/useDashboard';
import { selectCurrentUser } from '../../store/slices/authSlice';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const { stats, isLoading, error, refetch } = useDashboard();

  // Default stats structure
  const defaultStats = [
    { label: 'Total Patients', value: '0', icon: Users, color: 'blue', key: 'totalPatients' },
    { label: 'Appointments Today', value: '0', icon: Calendar, color: 'green', key: 'appointmentsToday' },
    { label: 'Available Doctors', value: '0', icon: Zap, color: 'purple', key: 'totalDoctors' },
    { label: 'Revenue (Month)', value: '$0', icon: TrendingUp, color: 'orange', key: 'revenueThisMonth' },
  ];

  // Map stats to display values
  const displayStats = defaultStats.map(stat => ({
    ...stat,
    value: stats[stat.key]?.toString() || '0',
  }));

  const userFullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email || 'User';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening in your hospital today.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          displayStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <AppointmentTrendChart />
            <AppointmentStatusChart />
          </>
        )}
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Jane Smith</p>
                <p className="text-sm text-gray-500">Check-up - 11:00 AM</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Scheduled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mike Johnson</p>
                <p className="text-sm text-gray-500">Follow-up - 2:00 PM</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Widget */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                   bg-primary-600 text-white text-sm font-medium
                   hover:bg-primary-700 active:bg-primary-800
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200">
              New Appointment
            </button>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                   bg-white text-gray-700 text-sm font-medium border border-gray-200
                   hover:bg-gray-50 active:bg-gray-100
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200">
              Add Patient
            </button>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                   bg-white text-gray-700 text-sm font-medium border border-gray-200
                   hover:bg-gray-50 active:bg-gray-100
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
