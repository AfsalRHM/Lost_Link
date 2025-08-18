import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";

import { adminService } from "../../../services/adminService";

import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";

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
  setRequestList: Dispatch<SetStateAction<Request[]>>;
}

const RequestListPart = ({
  allRequests,
  setRequestList,
}: RequestListPartProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
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
            {allRequests.map((request) => (
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
                    <p className="text-green-600 bg-white px-2 py-1 rounded-lg font-semibold text-lg">
                      Completed
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
  );
};

export default RequestListPart;
