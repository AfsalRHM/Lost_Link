const StatCardLoading = () => (
  <div className="p-6 rounded-xl shadow-md bg-blue-300/50 backdrop-blur-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      {/* Icon skeleton */}
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
        <div className="w-6 h-6 bg-blue-400 rounded"></div>
      </div>
    </div>
    {/* Title skeleton */}
    <div className="h-4 bg-blue-400 rounded w-32 mb-2"></div>
    {/* Value skeleton */}
    <div className="h-8 bg-blue-500 rounded w-20 mt-1"></div>
  </div>
);

export default StatCardLoading;
