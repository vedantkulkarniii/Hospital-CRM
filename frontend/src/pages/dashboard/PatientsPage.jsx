import { Users } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function PatientsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600 mt-1">Manage all patients in the system.</p>
      </div>

      <EmptyState
        icon={Users}
        title="No patients yet"
        description="Patient management module is coming soon. You'll be able to add, view, and manage all patient records here."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
