const MyRequestsLoading = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        My Requests
      </h2>

      {/* Skeleton for mobile view */}
      <div className="md:hidden space-y-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-3 animate-pulse bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-6 w-48 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Sl No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Request Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(4)].map((_, index) => (
                <tr key={index} className="animate-pulse bg-gray-100">
                  <td className="px-20 py-3 h-4 w-8 bg-gray-300 rounded"></td>
                  <td className="px-28 py-3 h-4 w-48 bg-gray-300 rounded"></td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyRequestsLoading;