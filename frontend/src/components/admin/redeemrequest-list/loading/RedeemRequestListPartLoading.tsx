const RedeemRequestListPartLoading = () => {
  const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Request Name
              </th>
              <th className="px-6 py-3 pl-[88px] text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Mobile Number
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
                    <div className="h-10 flex items-center justify-center">
                      {/* Request name skeleton */}
                      <div className="h-4 bg-blue-300 rounded w-36"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 pl-20 py-4 whitespace-nowrap">
                  {/* Status badge skeleton */}
                  <div className="h-6 bg-blue-300 rounded-full w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center space-x-4">
                    {/* Mobile number skeleton */}
                    <div className="h-4 bg-blue-300 rounded w-24"></div>
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

export default RedeemRequestListPartLoading;
