import { AlertCircle, CheckCircle, InfoIcon, XCircle, X } from 'lucide-react';

export default function Alert({ type = 'info', title, message, dismissible = true, onDismiss }) {
  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      titleColor: 'text-green-900',
      icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      titleColor: 'text-red-900',
      icon: XCircle,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      titleColor: 'text-yellow-900',
      icon: AlertCircle,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-900',
      icon: InfoIcon,
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex gap-3`}>
      {/* Icon */}
      <Icon size={20} className={`flex-shrink-0 ${config.textColor} mt-0.5`} />

      {/* Content */}
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h3>}
        {message && <p className={`text-sm ${config.textColor}`}>{message}</p>}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition`}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
