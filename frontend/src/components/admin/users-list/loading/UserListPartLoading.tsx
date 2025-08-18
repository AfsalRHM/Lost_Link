const UserListPartLoading = () => {
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
                    {/* Avatar skeleton */}
                    <div className="h-10 w-10 rounded-full bg-blue-300"></div>
                    <div className="ml-4">
                      {/* Username skeleton */}
                      <div className="h-4 bg-blue-300 rounded w-28 mb-2"></div>
                      {/* Email skeleton */}
                      <div className="h-3 bg-blue-200 rounded w-40"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Status badge skeleton */}
                  <div className="h-6 bg-blue-300 rounded-full w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-4">
                    {/* Block/Unblock button skeleton */}
                    <div className="h-10 bg-blue-300 rounded-lg w-20"></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-4">
                    {/* Details button skeleton */}
                    <div className="h-10 bg-blue-300 rounded-lg w-16"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListPartLoading;
