import { useEffect, useState } from "react";
import { userDataType } from "../../../interface/IuserModel";
import getMyRequests from "../../../api/user-api/getMyRequests";
import MyRequestsLoading from "./loading/MyRequestsLoading";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import { useNavigate } from "react-router-dom";

const MyRequests = ({ userData }: { userData: userDataType | undefined }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<any>([]);

  const [currentStatus, setCurrentStatus] = useState<string>("active");

  useEffect(() => {
    const getUserRequests = async () => {
      try {
        if (userData?.requests.length === 0) {
          return;
        } else {
          const response = await getMyRequests(userData?.requests);
          if (response.status === 200) {
            setRequests(response.data.data);
          } else {
            showErrorToast2(response.data.message);
          }
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserRequests();
  }, []);

  const handleDetailsPageClick = (id: string) => {
    if (id) {
      navigate(`/my_request_details`, { state: { requestId: id } });
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;

  const filteredRequests = requests.filter(
    (request: any) => request.status === currentStatus
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(requests.length / itemsPerPage);

  function handleStatusField(status: string) {
    setCurrentStatus(status);
    setCurrentPage(1);
  }

  if (loading) return <MyRequestsLoading />;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        My Requests
      </h2>

      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        {["active", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusField(status)}
            className={`text-sm font-medium capitalize focus:outline-none ${
              currentStatus === status
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-6m6 6v-4M3 3l18 18M4 4l16 16"
            />
          </svg>
          <p className="text-lg font-semibold">No {currentStatus} Requests</p>
          <p className="text-sm text-gray-400">
            You currently have no {currentStatus.toLowerCase()} requests.
          </p>
        </div>
      ) : (
        <>
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                      Sl No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Request Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 hidden md:block">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests
                    .slice(indexOfFirstRequest, indexOfLastRequest)
                    .map((request: any, index: number) =>
                      request.status !== currentStatus ? null : (
                        <tr
                          key={request._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-3 text-sm text-gray-700">
                            {indexOfFirstRequest + index + 1}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-700">
                            {request.product_name.length <= 25
                              ? request.product_name
                              : request.product_name.slice(0, 25) + "..."}
                          </td>
                          <td
                            className={`px-6 py-3 text-sm hidden md:block ${
                              request?.status === "active"
                                ? "text-green-700"
                                : request?.status === "cancelled"
                                ? "text-red-700"
                                : "text-orange-700"
                            }`}
                          >
                            {request.status}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <button
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                handleDetailsPageClick(request._id)
                              }
                            >
                              <span className="mr-2">👁️</span>Details
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              className="px-3 py-1.5 bg-gray-300 text-sm rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-sm"
                } rounded-md hover:bg-gray-400`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1.5 bg-gray-300 text-sm rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyRequests;
