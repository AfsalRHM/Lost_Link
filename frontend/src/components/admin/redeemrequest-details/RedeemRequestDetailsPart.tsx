import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Landmark, Package, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import requestRedeemType from "../../../interface/IrequestRedeem";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import fetchRedeemRequestDetails from "../../../api/admin-api/getRedeemRequestDetailsAPI";
import changeRedeemRequestStatus from "../../../api/admin-api/changeRedeemRequestStatusAPi";

const RedeemRequestDetailsPart = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const JwtErrors = useAdminJwtErrors();
  const [loading, setLoading] = useState<boolean>(true);
  const [redeemRequestData, setRedeemRequestData] = useState<
    requestRedeemType | undefined
  >();

  useEffect(() => {
    const getRedeemRequestData = async () => {
      try {
        if (!id) {
          showErrorToast2("Unable To Get Redeem Request Details");
          navigate(-1);
          return;
        }
        console.log(id, "this is the id ");
        const response = await fetchRedeemRequestDetails({
          redeemRequestId: id,
        });
        if (response && response.data && response.data.status) {
          setRedeemRequestData(response.data.data);
        } else if (response === false) {
          JwtErrors({ reason: "session expiration" });
          try {
            await adminLogout();
          } catch (logoutError) {
            console.error("Error during admin logout:", logoutError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Redeem Request Data:", error);
      } finally {
        setLoading(false);
      }
    };

    getRedeemRequestData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  async function handleStatusClick(clickEvent: string) {
    try {
      const response = await changeRedeemRequestStatus({
        changeTo: clickEvent,
        redeemRequestId: id,
      });
      if (response.status == 200) {
        showSuccessToast2("Status Changed Successfully");
        setRedeemRequestData((prevData) => ({
          ...prevData!,
          status: clickEvent,
        }));
      } else {
        showErrorToast2(response.data.message);
      }
    } catch (error) {
      console.log(error, "Error in the Handle Reject Click");
    }
  }

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-500 to-violet-600 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            className="px-6 py-2.5 text-violet-700 hover:text-violet-900 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            onClick={handleBack}
          >
            ← Back
          </button>
          <div
            className={`px-6 py-2.5 rounded-full text-sm font-semibold border shadow-sm ${
              redeemRequestData?.status === "pending"
                ? "border-yellow-200 bg-yellow-100 text-yellow-700"
                : redeemRequestData?.status === "accepted"
                ? "border-green-200 bg-green-100 text-green-700"
                : "border-red-200 bg-red-100 text-red-700"
            }`}
          >
            {redeemRequestData?.status.toUpperCase()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="text-center mb-8">
            <h6 className="text-3xl md:text-4xl font-bold text-violet-800 mb-6 underline">
              Redeem Request Details
            </h6>
            <div className="max-w-2xl mx-auto bg-violet-50 rounded-xl p-6">
              <div className="flex items-center gap-3 justify-center mb-4">
                <Package className="w-6 h-6 text-violet-600" />
                <span className="text-xl text-violet-800 font-semibold">
                  {redeemRequestData?.request_id.product_name}
                </span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <CreditCard className="w-6 h-6 text-violet-600" />
                <span className="text-xl text-violet-800 font-semibold">
                  ₹
                  {redeemRequestData?.request_id.reward_amount.toLocaleString()}
                  .00
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Finding Details
                </h2>
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Found Location</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.found_location}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Found Date</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {new Date(
                        redeemRequestData?.found_date!
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Damage Issues</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.damage_issues}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Contact Number</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.mobile_number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  Bank Details
                </h2>
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Bank Name</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.bank_name}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Account Holder</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.account_holder_name}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">Account Number</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.account_number}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-violet-600 text-sm">IFSC Code</p>
                    <p className="font-semibold text-violet-900 mt-1">
                      {redeemRequestData?.ifsc_code}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Found Item Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {redeemRequestData?.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={String(image)}
                        alt={`Found item ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Request Activity
                </h2>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-violet-600 text-sm">Created:</p>
                  <p className="font-semibold text-violet-900 mt-1">
                    {new Date(redeemRequestData?.createdAt!).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-10">
            {redeemRequestData?.status === "pending" ? (
              <>
                <button
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-1/3"
                  onClick={() => handleStatusClick("accepted")}
                >
                  Approve Request
                </button>

                <button
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-1/3"
                  onClick={() => handleStatusClick("rejected")}
                >
                  Reject Request
                </button>
              </>
            ) : (
              <div className="text-lg font-semibold text-green-700 bg-green-400 border px-3 py-1 rounded-md">
                {redeemRequestData?.status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemRequestDetailsPart;
