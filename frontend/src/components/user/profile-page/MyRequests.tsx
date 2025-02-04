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
  
  // To handle the request details page click
  const handleDetailsPageClick = (id: string) => {
    if (id) {
      navigate(`/my_request_details`, { state: { requestId: id } });
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(requests.length / itemsPerPage);

  if (loading) return <MyRequestsLoading />;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        My Requests
      </h2>

      <div className="md:hidden space-y-4">
        {currentRequests.map((request: any, index: number) => (
          <div
            key={request._id}
            className="border rounded-lg p-4 space-y-3 hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                #{indexOfFirstRequest + index + 1}
              </span>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-100 transition-colors">
                <span className="mr-2">👁️</span>Details
              </button>
            </div>
            <div className="text-gray-800">{request.name}</div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRequests.map((request: any, index: number) => (
                <tr
                  key={request._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {indexOfFirstRequest + index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {request.product_name}
                  </td>
                  <td className="px-6 py-3 text-sm text-green-700">
                    {request.status}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={() => handleDetailsPageClick(request._id)}
                    >
                      <span className="mr-2">👁️</span>Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
};

export default MyRequests;
