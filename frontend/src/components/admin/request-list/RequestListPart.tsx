import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import { showSuccessToast } from "../../../utils/toastUtils";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { Search } from "lucide-react";
import changeRequestStatus from "../../../api/admin-api/changeRequestStatus";
import { assignAdminAccessToken } from "../../../redux/slice/accessTokenSlice";

interface Request {
  _id: string;
  product_name: string;
  reward_amount: number;
  productCategory: string;
  travelMode: string;
  travelRoutes: string[];
  missingPlace: string;
  missingDate: string;
  expirationLimit: string;
  images: File[];
  additionalInfo: string;
  status: "active" | "inactive";
}

interface RequestListPartProps {
  allRequests: Request[];
  allRequestsFunc: () => Promise<void>;
}

const RequestListPart = ({
  allRequests,
  allRequestsFunc,
}: RequestListPartProps) => {
  const dispatch = useDispatch();
  const { adminAccessToken } = useSelector(
    (state: RootState) => state.accessToken
  );
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Request>("product_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const request: Request[] = allRequests;

  const handleSort = (field: keyof Request) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDetailsPage = (id: string) => {
    if (id) {
      navigate(`/admin/requestDetails`, { state: { userId: id } });
    }
  };

  const JwtErrors = useAdminJwtErrors();

  const handleStatusChange = async (id: string) => {
    const response = await changeRequestStatus({ requestId: id });
    await allRequestsFunc();
    if (response.status) {
      console.log(response);
      const token = response.headers["authorization"]?.split(" ")[1];
      dispatch(assignAdminAccessToken(token));
      showSuccessToast("Request Status Changed");
    } else if (response === false) {
      JwtErrors({ reason: "session expiration" });
      await adminLogout({
        accessToken: adminAccessToken,
      });
    } else {
      console.log("Unexpected response:", response);
    }
  };

  const filteredRequests = request
    .filter((request) =>
      request.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

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
              placeholder="Search users..."
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
                  onClick={() => handleSort("product_name")}
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
                  onClick={() => handleSort("reward_amount")}
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
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {request.product_name}
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
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-sm font-medium">
                      ₹{request.reward_amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleStatusChange(request._id)}
                      className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                        request.status === "active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {request.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDetailsPage(request._id)}
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
    </div>
  );
};

export default RequestListPart;
