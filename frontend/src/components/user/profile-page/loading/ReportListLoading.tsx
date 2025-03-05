const ReportsLoading = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 animate-pulse">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        My Reports
      </h2>

      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-6 w-20 bg-gray-300 rounded"></div>
        ))}
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 border-b">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-5 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-5 w-1/4 bg-gray-300 rounded hidden md:block"></div>
            <div className="h-5 w-12 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsLoading;
