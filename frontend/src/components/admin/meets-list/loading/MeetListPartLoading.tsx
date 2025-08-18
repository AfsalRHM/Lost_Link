const MeetListPartLoading = () => {
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {skeletonCards.map((index) => (
        <div
          key={index}
          className="bg-blue-700 rounded-lg overflow-hidden shadow-md animate-pulse"
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                {/* User name skeleton */}
                <div className="h-5 bg-blue-500 rounded w-32 mb-2"></div>
                {/* Date skeleton */}
                <div className="h-4 bg-blue-400 rounded w-40"></div>
              </div>
              {/* Status dot skeleton */}
              <div className="rounded-full w-3 h-3 mt-1 bg-blue-500"></div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-600">
              <div className="flex justify-between text-sm">
                {/* User ID label skeleton */}
                <div className="h-3 bg-blue-400 rounded w-12"></div>
                {/* User ID value skeleton */}
                <div className="h-3 bg-blue-500 rounded w-24 ml-2"></div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                {/* Request ID label skeleton */}
                <div className="h-3 bg-blue-400 rounded w-16"></div>
                {/* Request ID value skeleton */}
                <div className="h-3 bg-blue-500 rounded w-20 ml-2"></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-800 p-3 flex justify-end">
            {/* View Details button skeleton */}
            <div className="h-7 bg-blue-500 rounded-md w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetListPartLoading;
