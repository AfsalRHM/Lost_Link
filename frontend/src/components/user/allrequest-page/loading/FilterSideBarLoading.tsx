const FilterSideBarLoading = () => {
  return (
    <div className="lg:w-1/5 w-full bg-contact p-4 lg:min-h-screen shadow-md animate-pulse">
      {/* Filters title skeleton */}
      <div className="h-6 bg-gray-300 rounded w-16 mb-4"></div>

      {/* Location filter skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
        {/* Geoapify component skeleton - mimicking a search input */}
        <div className="w-full h-10 bg-gray-200 rounded-md border border-gray-300"></div>
      </div>

      {/* Minimum Reward filter skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="w-full h-10 bg-gray-200 rounded-md border border-gray-300"></div>
      </div>

      {/* Maximum Reward filter skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="w-full h-10 bg-gray-200 rounded-md border border-gray-300"></div>
      </div>
    </div>
  );
};

export default FilterSideBarLoading;
