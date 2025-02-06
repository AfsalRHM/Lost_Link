const RequestDetailsLoading = () => {
    return (
      <div className="w-full bg-violet-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="px-10 py-2.5 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="px-12 py-3 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
  
          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 animate-pulse">
            <div className="border-b border-gray-100 pb-6 mb-8">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            </div>
  
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                {/* Item Details */}
                <div>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-300 p-6 rounded-xl h-20"></div>
                    <div className="bg-gray-300 p-6 rounded-xl h-20"></div>
                  </div>
                </div>
  
                {/* Timeline */}
                <div>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
  
                {/* Additional Info */}
                <div>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-24 bg-gray-300 rounded"></div>
                </div>
              </div>
  
              {/* Images Section */}
              <div className="space-y-8">
                <div>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-gray-300 rounded-xl"></div>
                    <div className="h-32 bg-gray-300 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Buttons */}
            <div className="md:flex justify-center md:gap-5 md:my-8">
              <div className="w-full md:w-1/3 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RequestDetailsLoading;
  