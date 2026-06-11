export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
