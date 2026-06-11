import { CreditCard } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function BillingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">Manage billing and invoices.</p>
      </div>

      <EmptyState
        icon={CreditCard}
        title="No invoices yet"
        description="Billing module is coming soon. You'll be able to create, manage, and track invoices and payments."
        action={{ label: 'Learn More' }}
      />
    </div>
  );
}
