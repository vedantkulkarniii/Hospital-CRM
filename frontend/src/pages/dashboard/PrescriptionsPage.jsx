import { FileText } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function PrescriptionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-600 mt-1">Manage patient prescriptions.</p>
      </div>

      <EmptyState
        icon={FileText}
        title="No prescriptions yet"
        description="Prescription management module is coming soon. You'll be able to create and manage patient prescriptions here."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
