import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function AppointmentStatusChart({ data = [], title = 'Appointment Status Breakdown' }) {
  // Default mock data for demonstration
  const chartData = data.length > 0 ? data : [
    { name: 'Scheduled', value: 45, color: '#3b82f6' },
    { name: 'Completed', value: 120, color: '#10b981' },
    { name: 'Cancelled', value: 15, color: '#ef4444' },
    { name: 'Rescheduled', value: 25, color: '#f59e0b' },
  ];

  const COLORS = chartData.map(item => item.color);

  return (
    <div className="card h-96">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => `${name} (${value})`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
