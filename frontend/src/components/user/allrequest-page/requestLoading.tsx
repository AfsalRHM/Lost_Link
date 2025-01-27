const RequestLoading = () => {
    return (
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold underline text-center mb-6 text-violet-600">
          Loading Requests...
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-8 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default RequestLoading;
  