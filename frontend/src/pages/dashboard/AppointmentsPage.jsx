import { Calendar } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function AppointmentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-1">Manage all appointments in the system.</p>
      </div>

      <EmptyState
        icon={Calendar}
        title="No appointments yet"
        description="Appointment management module is coming soon. You'll be able to schedule, view, and manage all appointments here."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
