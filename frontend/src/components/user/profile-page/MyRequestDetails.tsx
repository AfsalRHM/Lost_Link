import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userService } from "../../../services/userService";

import {
  showConfirmToast,
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import IrequestModel from "../../../interface/IrequestModel";
import MyRequestDetailsLoading from "./loading/MyRequestDetailsLoadin";
import ChatPart from "./ChatPart";
import CommentSection from "../../shared/CommentSection";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

const MyRequestDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const requestId = location.state?.requestId;

  function goBackButton() {
    navigate(-1);
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [requestData, setRequestData] = useState<IrequestModel | undefined>(
    undefined
  );

  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const getRequestData = async () => {
      try {
        if (requestId == undefined) {
          showErrorToast2("Invalid Access Detected");
          return;
        } else {
          const response = await userService.getRequestDetails({
            requestId,
            from: "profile",
          });

          if (response.status == 200) {
            setRequestData(response.data.data.requestData);
          } else {
            console.log(
              response,
              "this is the error response on getRequestDetails"
            );
            UserErrorHandling(response, dispatch, navigate);
          }
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequestData();
  }, []);

  async function handleCancelRequest() {
    showConfirmToast(
      "Are you sure you want to cancel this request?",
      async () => {
        const requestId = requestData?._id;
        if (requestId) {
          const response = await userService.cancelRequest({ requestId });

          if (response.status == 200) {
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
            console.log(
              response,
              "this is the error response on cancelRequest"
            );
            UserErrorHandling(response, dispatch, navigate);
          }
        }
      }
    );
  }

  if (loading) {
    return <MyRequestDetailsLoading />;
  }

  return (
    <div className="w-full bg-banner min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            className="px-6 py-2.5 text-gray-700 hover:text-gray-900 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            onClick={goBackButton}
          >
            ← Back
          </button>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold border border-black ${
              requestData?.status === "active"
                ? "bg-green-300 text-gray-700"
                : requestData?.status === "cancelled"
                ? "bg-red-300 text-gray-700"
                : "bg-orange-300 text-gray-700"
            }`}
          >
            {requestData?.status.toUpperCase()}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {requestData?.product_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold text-blue-400">
                ₹{requestData?.reward_amount.toLocaleString()}.00 Reward
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <span className="text-gray-500 font-medium">
                {" "}
                Posted On :{" "}
                {requestData?.createdAt
                  ? new Date(requestData.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center gap-2 bg-red-200 px-4 py-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {requestData?.users_liked?.length || 0} Likes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Item Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-600 text-sm mb-1">Category</p>
                      <p className="font-semibold">
                        {requestData?.product_category}
                      </p>
                    </div>
                    {requestData?.missing_while == "specific" ? (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm mb-1">
                          Missing Place
                        </p>
                        <p className="font-semibold">
                          {requestData?.missing_place}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm mb-1">
                          Travelling On
                        </p>
                        <p className="font-semibold">
                          {requestData?.mode_of_travel}
                        </p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-600 text-sm mb-1">Last Seen</p>
                      <p className="font-semibold">{requestData?.last_seen}</p>
                    </div>
                    {requestData?.missing_while === "route" ? (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm mb-1">
                          Route of {requestData?.mode_of_travel}
                        </p>
                        <div className="font-semibold flex items-center flex-wrap gap-2">
                          {requestData?.missing_route.map(
                            (place: string, index: number) => (
                              <React.Fragment key={index}>
                                <span>{place}</span>
                                {index <
                                  requestData.missing_route.length - 1 && (
                                  <span className="text-gray-400">→</span>
                                )}
                              </React.Fragment>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-gray-600">
                      Missing since:{" "}
                      {requestData?.missing_date
                        ? new Date(
                            requestData.missing_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-gray-600">
                      Request Valid Upto : {requestData?.expiration_validity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-gray-600">
                      Request Expires in :{" "}
                      {requestData?.expiration_date
                        ? new Date(
                            requestData.expiration_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {requestData?.additional_information && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Additional Info.
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {requestData?.additional_information
                      ? requestData?.additional_information
                      : "No Additional Informations Provided..."}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Images</h2>
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
            </div>
          </div>
          <div className="md:flex justify-center md:gap-5 md:my-8">
            <button
              className="w-full md:w-1/3 px-6 py-3 bg-blue-400 text-white rounded-full font-semibold hover:bg-blue-500 transition-all duration-300 shadow-md hover:shadow-lg md:mb-0 mb-3"
              onClick={() => setShowChat(true)}
            >
              Chat with Admin
            </button>
            {requestData?.status == "active" ? (
              <button
                onClick={handleCancelRequest}
                className="w-full md:w-1/3 px-6 py-3 bg-red-400 text-white rounded-full font-semibold hover:bg-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancel Request
              </button>
            ) : null}
            {showChat && (
              <ChatPart
                requestId={requestData?._id}
                onClose={() => setShowChat(false)}
              />
            )}
          </div>
          <CommentSection requestId={requestId} noField={true} from="user" />
        </div>
      </div>
    </div>
  );
};

export default MyRequestDetails;
