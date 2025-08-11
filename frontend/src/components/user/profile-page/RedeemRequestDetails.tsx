import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userService } from "../../../services/userService";

import {
  ArrowLeft,
  MapPin,
  AlertTriangle,
  Building,
  CreditCard,
  User,
  Clock,
  Phone,
  Info,
  CheckCircle,
} from "lucide-react";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import MeetScheduleModal from "./MeetScheduleModal";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";
import IredeemRequestModel from "../../../interface/IrequestRedeem";

const RedeemRequestDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [requestRedeemData, setRequestRedeemData] = useState<
    IredeemRequestModel | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const redeemRequestId = location.state?.redeemRequestId;

  const [meetScheduleModalOpen, setMeetScheduleModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const getRequestData = async () => {
      try {
        if (redeemRequestId == undefined) {
          showErrorToast2("Invalid Access Detected");
          return;
        } else {
          const response = await userService.getRequestRedeemDetails({
            requestRedeemId: redeemRequestId,
          });

          if (response.status === 200) {
            setRequestRedeemData(response.data.data);
          } else {
            console.log(
              response,
              "this is the error response on getRequestRedeemDetails"
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

  function handleBack() {
    navigate(-1);
  }

  if (loading) {
    return <div>not available</div>;
  }

  const calculateExpiryDate = (startDate: Date, months: number) => {
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);
    return expiryDate.toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors border border-black p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>
          </div>
          {requestRedeemData?.status == "pending" ? (
            <div>
              <button
                // onClick={() => setVideoCall(!videoCall)}
                onClick={() => setMeetScheduleModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
              >
                Schedule a Meet
              </button>
            </div>
          ) : null}
        </div>
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r flex justify-between from-blue-600 to-blue-400 p-8">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-2">
                {requestRedeemData?.requestName}
              </h2>
              <div className="flex items-center text-blue-100 space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{requestRedeemData?.foundLocation}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>
                    Expires on:{" "}
                    {calculateExpiryDate(
                      requestRedeemData?.foundDate!,
                      parseInt(
                        requestRedeemData?.expirationValidity!.split(" ")[0]!
                      )
                    )}
                  </span>
                </div>
                <div className="md:flex items-center hidden">
                  <Info className="w-5 h-5 mr-2" />
                  <span>Status: {requestRedeemData?.status}</span>
                </div>
                <div className="md:flex items-center hidden">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>Contact: {requestRedeemData?.mobileNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Product Details */}
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-gray-800 underline">
                  Product Information
                </h3>

                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Reward Amount</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{requestRedeemData?.rewardAmount}.00
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">
                        {requestRedeemData?.itemCategory}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                    <h4 className="text-xl font-semibold text-gray-800">
                      Damage Assessment
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    {requestRedeemData?.damageIssues || "No damage reported"}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-6 ${
                    requestRedeemData?.status.toLowerCase() === "pending"
                      ? "bg-yellow-50"
                      : requestRedeemData?.status.toLowerCase() === "rejected"
                      ? "bg-red-50"
                      : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {requestRedeemData?.status.toLowerCase() === "pending" && (
                      <Clock className="w-6 h-6 text-yellow-500 mr-3" />
                    )}
                    {requestRedeemData?.status.toLowerCase() === "rejected" && (
                      <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                    )}
                    {requestRedeemData?.status.toLowerCase() === "approved" && (
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                    )}
                    <h4 className="text-xl font-semibold text-gray-800">
                      Submission Status
                    </h4>
                  </div>
                  <p className="text-gray-700">{requestRedeemData?.status}</p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-gray-800 underline">
                  Bank Details
                </h3>

                <div className="bg-green-50 rounded-lg p-6 space-y-6">
                  <div className="flex items-center">
                    <Building className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {requestRedeemData?.bankName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {requestRedeemData?.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {requestRedeemData?.accountHolder}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">IFSC Code</p>
                    <p className="text-mono font-semibold text-gray-800">
                      {requestRedeemData?.ifscCode}
                    </p>
                  </div>
                </div>
              </div>
              {requestRedeemData?.images?.length! > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 underline">
                    Item Images
                  </h3>
                  <div className="flex gap-6">
                    {requestRedeemData?.images.map(
                      (image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-60 h-full object-cover rounded-lg shadow-md"
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {meetScheduleModalOpen ? (
        <MeetScheduleModal
          onClose={() => setMeetScheduleModalOpen(false)}
          requestId={redeemRequestId}
        />
      ) : null}
    </div>
  );
};

export default RedeemRequestDetails;
