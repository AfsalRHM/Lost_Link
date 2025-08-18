const RequestListPartLoading = () => {
  const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Reward
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-blue-400 divide-y divide-gray-200">
            {skeletonRows.map((index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      {/* Product name skeleton */}
                      <div className="h-4 bg-blue-300 rounded w-32 mb-2"></div>
                      {/* Product category skeleton */}
                      <div className="h-3 bg-blue-200 rounded w-24"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Status badge skeleton */}
                  <div className="h-6 bg-blue-300 rounded-full w-18"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Reward amount skeleton */}
                  <div className="h-4 bg-blue-300 rounded w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {/* Actions button skeleton - varying widths to simulate different states */}
                  {index % 3 === 0 ? (
                    <div className="h-10 bg-blue-300 rounded-lg w-24"></div>
                  ) : index % 3 === 1 ? (
                    <div className="h-8 bg-blue-300 rounded-lg w-20"></div>
                  ) : (
                    <div className="h-10 bg-blue-300 rounded-lg w-20"></div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {/* Details button skeleton */}
                  <div className="h-10 bg-blue-300 rounded-lg w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestListPartLoading;
