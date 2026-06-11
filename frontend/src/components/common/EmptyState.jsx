import { AlertCircle } from 'lucide-react';

export default function EmptyState({ icon: Icon = AlertCircle, title, description, action }) {
  return (
    <div className="card">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {Icon && <Icon size={32} className="text-gray-400" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 max-w-sm mb-6">{description}</p>
        {action && (
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                   bg-primary-600 text-white text-sm font-medium
                   hover:bg-primary-700 active:bg-primary-800
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
