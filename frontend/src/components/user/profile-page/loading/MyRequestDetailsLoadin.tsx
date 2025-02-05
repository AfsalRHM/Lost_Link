const MyRequestDetailsLoading = () => {
    return (
      <div className="w-full bg-banner min-h-screen p-4 md:p-8 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button & Status Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-10 w-40 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
          </div>
  
          {/* Main Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
            {/* Title Skeleton */}
            <div className="h-8 w-3/4 bg-gray-300 rounded-md"></div>
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
              <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
            </div>
  
            {/* Item Details Skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className="h-20 bg-gray-300 rounded-xl"
                    ></div>
                  ))}
                </div>
              </div>
  
              {/* Image Skeletons */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-300 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
  
            {/* Timeline Section Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-4 w-52 bg-gray-300 rounded-md"></div>
              ))}
            </div>
  
            {/* Buttons Skeleton */}
            <div className="flex gap-4 mt-6">
              <div className="h-12 w-1/3 bg-gray-300 rounded-full"></div>
              <div className="h-12 w-1/3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default MyRequestDetailsLoading;
  