import { BarChart3 } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">View hospital analytics and reports.</p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="No reports yet"
        description="Reports module is coming soon. You'll be able to generate and view comprehensive hospital analytics and reports."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
