import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AppointmentTrendChart({ data = [], title = 'Appointments Trend (Last 7 Days)' }) {
  // Default mock data for demonstration
  const chartData = data.length > 0 ? data : [
    { date: 'Mon', appointments: 12, completed: 8 },
    { date: 'Tue', appointments: 15, completed: 12 },
    { date: 'Wed', appointments: 10, completed: 9 },
    { date: 'Thu', appointments: 18, completed: 16 },
    { date: 'Fri', appointments: 22, completed: 20 },
    { date: 'Sat', appointments: 14, completed: 13 },
    { date: 'Sun', appointments: 8, completed: 6 },
  ];

  return (
    <div className="card h-96">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Area
            type="monotone"
            dataKey="appointments"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorAppointments)"
            name="Total Appointments"
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorCompleted)"
            name="Completed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
