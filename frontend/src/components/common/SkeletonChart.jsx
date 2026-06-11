export default function SkeletonChart() {
  return (
    <div className="card h-96">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-end gap-2 h-32 mt-6">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded"
              style={{ height: `${Math.random() * 80 + 20}px`, width: '20px' }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
