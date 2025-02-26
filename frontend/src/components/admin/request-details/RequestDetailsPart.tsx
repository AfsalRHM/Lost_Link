import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock, Tag, MapPin } from "lucide-react";
import {
  showConfirmToast,
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import fetchRequestDetails from "../../../api/admin-api/getRequestDetails";
import { RequestModel } from "../../../interface/IrequestModel";
import requestRedeemType from "../../../interface/IrequestRedeem";
import changeRequestStatus from "../../../api/admin-api/changeRequestStatus";
import { showSuccessToast } from "../../../utils/toastUtils";
import cancelRequest from "../../../api/user-api/cancelRequestAPI";

const RequestDetailsPart = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const JwtErrors = useAdminJwtErrors();

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<RequestModel | undefined>(
    undefined
  );
  const [redeemRequests, setRedeemRequests] = useState<requestRedeemType | []>(
    []
  );

  useEffect(() => {
    const getRequestData = async () => {
      try {
        if (!id) {
          showErrorToast2("Unable To Get Request Details");
          navigate(-1);
          return;
        }
        const response = await fetchRequestDetails({ requestId: id });
        if (response && response.data && response.data.status) {
          setRequestData(response.data.data.requestData);
          if (response.data.data.redeemRequestData) {
            setRedeemRequests(response.data.data.redeemRequestData);
          }
        } else if (response === false) {
          JwtErrors({ reason: "session expiration" });
          try {
            await adminLogout();
          } catch (logoutError) {
            console.error("Error during admin logout:", logoutError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Request Data:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequestData();
  }, [id]);

  function handleBack() {
    navigate(-1);
  }

  function handleRedeemRequestDetails(id: string) {
    if (id) {
      navigate(`/admin/redeem-requests/details/${id}`);
    }
  }

  async function handleStatusChange() {
    const response = await changeRequestStatus({ requestId: id });
    if (response.status) {
      if (requestData) {
        const newStatus =
          requestData?.status === "active" ? "inactive" : "active";
        setRequestData({ ...requestData, status: newStatus });
        showSuccessToast("Request Status Changed");
      }
    }
  }

  async function handleRequestCancel() {
    showConfirmToast(
      "Are you sure you want to cancel this request?",
      async () => {
        if (id) {
          const response = await cancelRequest({ requestId: id });
          console.log(response);
          if (response.status) {
            setRequestData((prev) => {
              if (prev) {
                return {
                  ...prev,
                  status: "cancelled",
                };
              }
              return prev;
            });
            showSuccessToast2(response.data.message);
          } else {
            showErrorToast2(response.data.message);
          }
        }
      }
    );
  }

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return (
    <div className="w-full bg-blue-500 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            className="px-6 py-2.5 text-violet-700 hover:text-violet-900 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            onClick={handleBack}
          >
            ← Back
          </button>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              requestData?.status === "active"
                ? "border-green-200 bg-green-100 text-green-700"
                : requestData?.status == "completed"
                ? "bg-green-600 border-green-200"
                : "border-red-200 bg-red-100 text-red-700"
            }`}
          >
            {requestData?.status?.toUpperCase()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-violet-800 mb-4">
              {requestData?.product_name}
            </h1>
            <div className="flex items-center gap-4 text-violet-600">
              <span className="text-2xl font-bold">
                ₹{requestData?.reward_amount.toLocaleString()}.00 Reward
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Item Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-5 h-5 text-violet-600" />
                      <p className="text-violet-600 text-sm">Category</p>
                    </div>
                    <p className="font-semibold text-violet-900">
                      {requestData?.product_category}
                    </p>
                  </div>

                  <div className="bg-violet-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-violet-600" />
                      <p className="text-violet-600 text-sm">Last Seen</p>
                    </div>
                    <p className="font-semibold text-violet-900">
                      {requestData?.last_seen}
                    </p>
                  </div>

                  {requestData?.missing_while === "route" ? (
                    <div className="bg-violet-50 p-4 rounded-xl col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-violet-600" />
                        <p className="text-violet-600 text-sm">Travel Route</p>
                      </div>
                      <div className="font-semibold text-violet-900 flex items-center flex-wrap gap-2">
                        {requestData?.missing_route.map((place, index) => (
                          <span key={index}>
                            {place}
                            {index < requestData.missing_route.length - 1 && (
                              <span className="text-violet-400 mx-2">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-violet-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-violet-600" />
                        <p className="text-violet-600 text-sm">Missing Place</p>
                      </div>
                      <p className="font-semibold text-violet-900">
                        {requestData?.missing_place}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">
                      Missing since:{" "}
                      {new Date(
                        requestData?.missing_date || ""
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">
                      Valid for: {requestData?.expiration_validity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">
                      Expires on:{" "}
                      {new Date(
                        requestData?.expiration_date || ""
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {requestData?.additional_information && (
                <div>
                  <h2 className="text-xl font-bold text-violet-800 mb-4">
                    Additional Information
                  </h2>
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <p className="text-violet-900">
                      {requestData.additional_information ||
                        "No additional information provided"}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-violet-800 mb-4">
                  Redeem Requests
                </h2>

                {Array.isArray(redeemRequests) && redeemRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-violet-300 rounded-lg shadow-md">
                      <thead className="bg-violet-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-violet-900">
                            SI No.
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-violet-900">
                            Request Name
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-violet-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {redeemRequests.map(
                          (request: requestRedeemType, index: number) => (
                            <tr
                              key={request._id}
                              className="hover:bg-violet-50 transition-colors"
                            >
                              <td className="px-4 py-3 text-violet-700">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 text-violet-700">
                                {request.request_id?.product_name || "Unknown"}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() =>
                                    handleRedeemRequestDetails(request?._id)
                                  }
                                  className="bg-violet-600 text-white px-3 py-1.5 rounded-md hover:bg-violet-700 transition-all"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 text-lg mt-4">
                    No Redeem Requests Available
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Product Images
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {requestData?.product_images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden shadow-md"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Request Activity
                </h2>
                <div className="bg-violet-50 p-4 rounded-xl space-y-3">
                  <div>
                    <p className="text-violet-600 text-sm">Created:</p>
                    <p className="font-semibold text-violet-900">
                      {new Date(requestData?.createdAt || "").toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-violet-600 text-sm">Last Updated:</p>
                    <p className="font-semibold text-violet-900">
                      {new Date(requestData?.updatedAt || "").toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {requestData?.status === "cancelled" ? (
              <p className="text-red-600 font-semibold text-lg">
                Request Cancelled
              </p>
            ) : requestData?.status == "completed" ? (
              <p className="text-green-600 font-semibold text-lg">
                Request Completed
              </p>
            ) : (
              <>
                <button
                  className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-1/3"
                  onClick={handleStatusChange}
                >
                  {requestData?.status === "active"
                    ? "Block Request"
                    : "Activate Request"}
                </button>

                <button
                  className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-1/3"
                  onClick={handleRequestCancel}
                >
                  Cancel Request
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPart;
