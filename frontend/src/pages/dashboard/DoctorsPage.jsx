import { Stethoscope } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function DoctorsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
        <p className="text-gray-600 mt-1">Manage all doctors in the system.</p>
      </div>

      <EmptyState
        icon={Stethoscope}
        title="No doctors yet"
        description="Doctor management module is coming soon. You'll be able to add and manage doctor profiles, specializations, and schedules."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
