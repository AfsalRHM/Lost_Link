import { useState } from "react";
import { Sidebar } from "../../shared/Sidebar";
import NavBar from "../../shared/Navbar";

const DashboardPageLoading = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skeleton StatCard component
  const StatCardSkeleton = () => (
    <div className="bg-blue-300/50 backdrop-blur-sm rounded-xl p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          {/* Title skeleton */}
          <div className="h-3 bg-blue-400 rounded w-24 mb-2"></div>
          {/* Value skeleton */}
          <div className="h-6 bg-blue-500 rounded w-16"></div>
        </div>
        {/* Icon skeleton */}
        <div className="w-6 h-6 bg-blue-400 rounded"></div>
      </div>
    </div>
  );

  // Skeleton Chart component
  const ChartSkeleton = () => (
    <div className="bg-blue-800/50 rounded-xl p-4 backdrop-blur-sm shadow-md animate-pulse">
      {/* Chart title skeleton */}
      <div className="h-5 bg-blue-400 rounded w-24 mb-4"></div>
      {/* Chart area skeleton */}
      <div className="h-64 bg-blue-600/30 rounded-lg flex items-end justify-center space-x-2 p-4">
        {/* Chart bars/lines skeleton */}
        <div className="w-full h-32 bg-blue-500/40 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 text-white">
      <div
        className={`lg:block fixed top-0 left-0 w-64 h-full bg-blue-900/70 backdrop-blur-md shadow-lg z-10 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <NavBar setSidebarOpen={setSidebarOpen} />
        <main className="p-4 md:p-6 lg:p-8 animate-pulse">
          {/* Header section skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-blue-400 rounded w-64 mb-2"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-blue-300 rounded w-96"></div>
            </div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* User Trend Chart skeleton */}
          <div className="mb-8">
            <ChartSkeleton />
          </div>

          {/* Request Trend Chart skeleton */}
          <div className="mb-8">
            <ChartSkeleton />
          </div>

          {/* Redeem Request Trend Chart skeleton */}
          <div className="mb-8">
            <ChartSkeleton />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPageLoading;
