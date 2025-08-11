import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";

import { adminService } from "../../../services/adminService";

import IrequestModel from "../../../interface/IrequestModel";

import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { Search } from "lucide-react";

type Request = {
  id: string;
  productName: string;
  productCategory: string;
  status: string;
  rewardAmount: number;
  createdAt: Date;
};

interface RequestListPartProps {
  allRequests: Request[];
  allRequestsFunc: () => Promise<void>;
  setRequestList: Dispatch<SetStateAction<Request[]>>;
}

const RequestListPart = ({
  allRequests,
  setRequestList,
}: RequestListPartProps) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] =
    useState<keyof IrequestModel>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const request: Request[] = allRequests;

  const handleSort = (field: keyof IrequestModel) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDetailsPage = (id: string) => {
    if (id) {
      navigate(`/admin/requests/request-details/${id}`);
    }
  };

  const handleStatusChange = async (id: string) => {
    const previousData = [...allRequests];

    setRequestList(
      allRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: request.status === "active" ? "inactive" : "active",
            }
          : request
      )
    );

    try {
      const response = await adminService.updateRequest({ requestId: id });

      if (response.status == 200) {
        showSuccessToast(response.data.message);
      }
    } catch (error) {
      setRequestList(previousData);
      showErrorToast("Failed to update request status");
    }
  };

  const filteredRequests = request
    .filter((request) =>
      request.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: Request, b: Request) => {
      const field = sortField as keyof Request;

      if (sortDirection === "asc") {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });

  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredRequests.length / itemsPerPage))
      return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white mb-4 sm:mb-0">
          Requests
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
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("productName")}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("rewardAmount")}
                >
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
              {currentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {request.productName}
                        </div>
                        <div className="text-sm text-black">
                          {request.productCategory}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex text-sm font-medium px-2 py-1 rounded ${
                        request.status === "active"
                          ? "bg-green-100 text-green-800"
                          : request.status == "completed"
                          ? "bg-green-500"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-sm font-medium">
                      ₹{request.rewardAmount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {request.status === "cancelled" ? (
                      <p className="text-red-600 bg-white px-2 py-1 rounded-lg font-semibold text-lg">
                        Cancelled
                      </p>
                    ) : request.status === "completed" ? (
                      <p className="px-2 py-1 rounded-sm font-semibold text-lg">
                        Not Available
                      </p>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(request.id)}
                        className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                          request.status === "active"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {request.status === "active" ? "Block" : "Unblock"}
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDetailsPage(request.id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-white">
          Page {currentPage} of{" "}
          {Math.ceil(filteredRequests.length / itemsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredRequests.length / itemsPerPage)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestListPart;
