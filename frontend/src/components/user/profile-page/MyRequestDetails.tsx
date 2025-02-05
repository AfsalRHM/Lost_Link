import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import IrequestModel from "../../../interface/IrequestModel";
import getRequestDetails from "../../../api/user-api/getRequestDetails";
import MyRequestDetailsLoading from "./loading/MyRequestDetailsLoadin";

const MyRequestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const requestId = location.state?.requestId;

  function goBackButton() {
    navigate(-1);
  }

  console.log(requestId);

  const [loading, setLoading] = useState<boolean>(true);
  const [requestData, setRequestData] = useState<IrequestModel | undefined>(
    undefined
  );

  useEffect(() => {
    const getRequestData = async () => {
      try {
        if (requestId == undefined) {
          showErrorToast2("Invalid Access Detected");
          // Redirect to Page not found page
          return;
        } else {
          const response = await getRequestDetails(requestId);
          if (response.status === 200) {
            setRequestData(response.data.data);
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

    getRequestData();
  }, []);

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
            ← Back to Profile
          </button>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold border border-black ${
              requestData?.status === "active"
                ? "bg-green-300 text-gray-700"
                : "bg-red-300 text-gray-700"
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
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-500 font-medium">
                {" "}
                Posted On :{" "}
                {requestData?.createdAt
                  ? new Date(requestData.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
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

              <div className="bg-gray-50 rounded-xl p-6"></div>
            </div>
          </div>
          <div className="md:flex justify-center md:gap-5 md:my-8">
            <button className="w-full md:w-1/3 px-6 py-3 bg-blue-400 text-white rounded-full font-semibold hover:bg-blue-500 transition-all duration-300 shadow-md hover:shadow-lg md:mb-0 mb-3">
              Chat with Admin
            </button>
            {requestData?.status == "active" ? (
              <button className="w-full md:w-1/3 px-6 py-3 bg-red-400 text-white rounded-full font-semibold hover:bg-red-500 transition-all duration-300 shadow-md hover:shadow-lg">
                Cancel Request
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequestDetails;
