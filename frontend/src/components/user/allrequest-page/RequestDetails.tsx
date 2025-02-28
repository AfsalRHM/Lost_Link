import React, { useEffect, useState } from "react";
import IrequestModel from "../../../interface/IrequestModel";
import { useNavigate, useSearchParams } from "react-router-dom";
import RequestDetailsLoading from "./loading/RequestDetailsLoading";
import getRequestDetails from "../../../api/user-api/getRequestDetails";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import changeLikeStatus from "../../../api/user-api/changeLikeStatusAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import {
  Heart,
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Info,
  Share2,
  Flag,
} from "lucide-react";
import CommentSection from "../../shared/CommentSection";
import ReportModal from "./ReportModal";

const RequestDetails = ({}) => {
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [requestAlreadyRedeemed, setRequestAlreadyRedeemed] =
    useState<boolean>(false);
  const [requestData, setRequestData] = useState<IrequestModel | undefined>(
    undefined
  );

  const { userId } = useSelector((state: RootState) => state.userDetails);

  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportAlreadySend, setReportAlreadySend] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getRequestData = async () => {
      try {
        if (requestId == undefined) {
          showErrorToast2("Invalid Access Detected");
          return;
        } else {
          const response = await getRequestDetails({
            requestId,
            from: "normalRequest",
          });
          console.log(response);
          if (response.status === 200) {
            setRequestData(response.data.data.requestData);
            setLikeCount(response.data.data.requestData.users_liked.length);
            setHasLiked(
              response.data.data.requestData.users_liked.includes(userId)
            );
            if (response.data.data.redeemRequestData) {
              setRequestAlreadyRedeemed(true);
            }
            if (response.data.data.reportData) {
              setReportAlreadySend(true);
            }
          } else {
            showErrorToast2(response.data.message);
            navigate("/requests");
          }
        }
      } catch (error) {
        console.error("Failed to fetch Request Data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getRequestData();
  }, [requestId]);

  function handleBack() {
    navigate(-1);
  }

  function handleRedeemRequest(id: string) {
    navigate("/requests/redeem-request", { state: { requestId: id } });
  }

  const handleLikeRequest = async () => {
    setHasLiked(!hasLiked);
    setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
    if (!requestId) return;
    try {
      const response = await changeLikeStatus({ requestId });
      if (response.status !== 200) {
        setHasLiked(!hasLiked);
        setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
        showErrorToast2(response.message);
      }
    } catch (error) {
      console.error("Failed to Like Request:", error);
      showErrorToast2("Something went wrong!");
    }
  };

  function handleCopyLink() {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    showSuccessToast2("Request link copied to clipboard");
  }

  const handleReportRequest = () => {
    setIsReportModalOpen(true);
  };

  if (loading) {
    return <RequestDetailsLoading />;
  }

  return (
    <div className="w-full bg-violet-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            className="px-6 py-2.5 text-violet-700 hover:text-violet-900 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center justify-center my-6">
            <button
              onClick={handleLikeRequest}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
                hasLiked
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Heart size={18} fill={hasLiked ? "white" : "none"} /> {likeCount}{" "}
              Likes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <div className="flex justify-between">
              <h1 className="text-3xl md:text-4xl font-bold text-violet-800 mb-4">
                {requestData?.product_name}
              </h1>
              <div className="md:flex gap-2">
                <div className="mb-2 md:mb-0">
                  <button
                    onClick={handleCopyLink}
                    className="flex gap-2 px-4 py-2 md:ml-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                  >
                    <span className="hidden md:block">Share</span>
                    <Share2 />
                  </button>
                </div>
                <div>
                  <button
                    onClick={handleReportRequest}
                    disabled={reportAlreadySend}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-md transition-all duration-300 ${
                      reportAlreadySend
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    <Flag className="w-5 h-5" />
                    <span className="hidden md:inline font-medium">
                      {reportAlreadySend ? "Reported" : "Report"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {isReportModalOpen ? (
              <ReportModal
                setIsReportModalOpen={setIsReportModalOpen}
                requestId={requestId}
                setReportAlreadySend={setReportAlreadySend}
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold text-violet-600">
                ₹{requestData?.reward_amount?.toLocaleString()}.00 Reward
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-500 font-medium flex items-center gap-2">
                <Calendar size={16} />
                Posted On:{" "}
                {requestData?.createdAt
                  ? new Date(requestData.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                  <Tag size={20} /> Item Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <p className="text-violet-600 text-sm mb-1">Category</p>
                    <p className="font-semibold text-violet-900">
                      {requestData?.product_category}
                    </p>
                  </div>
                  {requestData?.missing_while == "specific" ? (
                    <div className="bg-violet-50 p-4 rounded-xl">
                      <p className="text-violet-600 text-sm mb-1">
                        Missing Place
                      </p>
                      <p className="font-semibold text-violet-900">
                        {requestData?.missing_place}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-violet-50 p-4 rounded-xl">
                      <p className="text-violet-600 text-sm mb-1">
                        Travelling On
                      </p>
                      <p className="font-semibold text-violet-900">
                        {requestData?.mode_of_travel}
                      </p>
                    </div>
                  )}
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <p className="text-violet-600 text-sm mb-1">Last Seen</p>
                    <p className="font-semibold text-violet-900">
                      {requestData?.last_seen}
                    </p>
                  </div>
                  {requestData?.missing_while === "route" ? (
                    <div className="bg-violet-50 p-4 rounded-xl">
                      <p className="text-violet-600 text-sm mb-1">
                        Route of {requestData?.mode_of_travel}
                      </p>
                      <div className="font-semibold flex items-center flex-wrap gap-2">
                        {requestData?.missing_route.map(
                          (place: string, index: number) => (
                            <React.Fragment key={index}>
                              <span>{place}</span>
                              {index < requestData.missing_route.length - 1 && (
                                <span className="text-violet-900">→</span>
                              )}
                            </React.Fragment>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                  <Clock size={20} /> Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    <p className="text-violet-600">
                      Missing since:{" "}
                      {requestData?.missing_date
                        ? new Date(
                            requestData.missing_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    <p className="text-violet-600">
                      Request Valid Upto: {requestData?.expiration_validity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    <p className="text-violet-600">
                      Request Expires in:{" "}
                      {requestData?.expiration_date
                        ? new Date(
                            requestData.expiration_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                  <Info size={20} /> Additional Info
                </h2>
                <p className="text-violet-600 leading-relaxed">
                  {requestData?.additional_information ||
                    "No additional information available"}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Images
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
            </div>
          </div>

          <div className="md:flex justify-center md:gap-5 md:my-8">
            {requestAlreadyRedeemed ? (
              <h2 className="text-xl font-semibold mb-2 text-orange-600">
                Request Already Redeemed!
              </h2>
            ) : (
              <button
                className="w-full md:w-1/3 px-6 py-3 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-all duration-300 shadow-md hover:shadow-lg md:mb-0 mb-3"
                onClick={() =>
                  handleRedeemRequest(
                    requestData && requestData._id ? requestData._id : ""
                  )
                }
              >
                Redeem Request
              </button>
            )}
          </div>

          <CommentSection requestId={requestId} noField={false} />
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
