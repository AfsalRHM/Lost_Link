import { useState } from "react";
import { useNavigate } from "react-router-dom";

import requestRedeemType from "../../../interface/IrequestRedeem";
import { Search } from "lucide-react";

interface UserListPartProps {
  allRedeemRequests: any;
}

const RedeemRequestListPart = ({ allRedeemRequests }: UserListPartProps) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleDetailsPage = (id: string) => {
    if (id) {
      navigate(`/admin/redeem-requests/details/${id}`);
    }
  };

  const filteredRedeemRequests = allRedeemRequests.filter(
    (redeemRequest: requestRedeemType) =>
      redeemRequest.request_id.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRedeemRequests.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedRedeemRequests = filteredRedeemRequests.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white mb-4 sm:mb-0">
          Redeem Requests
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search Requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-blue-300 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

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
              {paginatedRedeemRequests.map(
                (redeemRequest: requestRedeemType) => (
                  <tr key={redeemRequest._id} className="hover:bg-blue-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 flex items-center justify-center">
                          <span className="text-black font-medium">
                            {redeemRequest.request_id.product_name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 pl-20 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex text-sm font-medium px-2 py-1 rounded ${
                          redeemRequest.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {redeemRequest.status.charAt(0).toUpperCase() +
                          redeemRequest.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-4">
                        <p className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors">
                          {redeemRequest.mobile_number}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleDetailsPage(redeemRequest._id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-5 items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RedeemRequestListPart;
