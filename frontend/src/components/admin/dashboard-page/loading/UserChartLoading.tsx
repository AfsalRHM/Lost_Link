import {
  Users,
  CalendarRange,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";

const UserChartLoading = () => {
  return (
    <div className="animate-pulse">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-300 opacity-50" />
            <div className="h-5 bg-blue-400 rounded w-32"></div>
          </div>
          <div className="flex items-center px-2 py-1 bg-blue-800/30 rounded-md">
            <CalendarRange
              size={14}
              className="mr-1 text-blue-300 opacity-50"
            />
            <div className="h-3 bg-blue-400 rounded w-16"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="p-2 rounded-md bg-blue-800/30 cursor-not-allowed opacity-50">
              <Filter size={16} className="text-blue-300" />
            </button>
          </div>

          <button className="p-2 rounded-md bg-blue-800/30 cursor-not-allowed opacity-50">
            <Download size={16} className="text-blue-300" />
          </button>

          <button className="p-2 rounded-md bg-blue-800/30 cursor-not-allowed opacity-50">
            <MoreHorizontal size={16} className="text-blue-300" />
          </button>
        </div>
      </div>

      {/* Main chart skeleton */}
      <div className="h-72 bg-blue-800/20 rounded-lg relative overflow-hidden">
        {/* Grid lines skeleton */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full h-px bg-blue-600/20"></div>
          ))}
        </div>

        {/* Vertical grid lines */}
        <div className="absolute inset-0 flex justify-between p-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-px h-full bg-blue-600/20"></div>
          ))}
        </div>

        {/* Chart area curves skeleton */}
        <div className="absolute inset-4 flex items-end justify-between">
          {/* Simulate area chart with varying heights */}
          {[...Array(12)].map((_, i) => {
            const heights = [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65];
            return (
              <div
                key={i}
                className="flex-1 mx-1 bg-gradient-to-t from-blue-500/30 to-blue-400/10 rounded-t-sm"
                style={{ height: `${heights[i]}%` }}
              ></div>
            );
          })}
        </div>

        {/* X-axis labels skeleton */}
        <div className="absolute bottom-2 left-4 right-4 flex justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-blue-400 rounded w-8"></div>
          ))}
        </div>

        {/* Y-axis labels skeleton */}
        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-blue-400 rounded w-6"></div>
          ))}
        </div>

        {/* Loading overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-blue-300 text-sm opacity-70">
            Loading chart...
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChartLoading;
