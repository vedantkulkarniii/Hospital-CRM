import { Settings } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and preferences.</p>
      </div>

      <EmptyState
        icon={Settings}
        title="Settings coming soon"
        description="Settings module is coming soon. You'll be able to manage your profile, preferences, and account settings."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
