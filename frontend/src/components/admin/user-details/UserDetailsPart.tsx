import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { adminService } from "../../../services/adminService";

import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import UserDetailsPartLoading from "./loading/UserDetailsPartLoading";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";

const UserDetailsPart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(undefined);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!id) {
          showErrorToast2("Unable To Get User Details");
          console.log("user id didn't passed through the url");
          navigate(-1);
        }

        const response = await adminService.getUser({ userId: id! });

        if (response.status == 200) {
          setUserData(response.data.data);
          setLoading(false);
        } else {
          console.log(
            response,
            "this is the error response on fetchUserDetails"
          );
          AdminErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Failed to fetch User Data:", error);
        setLoading(false);
      }
    };

    getUserData();
  }, [id]);

  function handleBack() {
    navigate(-1);
  }

  async function handleStatusChange() {
    const response = await adminService.updateUser({ userId: id! });

    if (response.status == 200) {
      const newStatus = userData.status === "active" ? "inactive" : "active";
      setUserData({ ...userData, status: newStatus });
      showSuccessToast2("User Status Changed");
    } else {
      console.log(response, "this is the error response on changeStatus");
      AdminErrorHandling(response, dispatch, navigate);
    }
  }

  if (loading) {
    return <UserDetailsPartLoading />;
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
          <div className="px-4 py-2 rounded-full text-sm font-semibold border border-violet-200 bg-violet-100 text-violet-700">
            {userData?.status?.toUpperCase()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <div className="flex items-center gap-6 mb-4">
              {userData?.profile_pic ? (
                <img
                  src={userData.profile_pic}
                  alt={userData.full_name}
                  className="w-24 h-24 rounded-full border-4 border-violet-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-bold text-white">
                  {userData?.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-violet-800">
                  {userData?.full_name}
                </h1>
                <p className="text-violet-600">@{userData?.user_name}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">{userData?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">
                      {userData?.phone
                        ? userData.phone
                        : "Mobile Number not Available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">
                      {userData?.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    <span className="text-violet-900">
                      Joined:{" "}
                      {new Date(userData?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Account Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-violet-600" />
                      <p className="text-violet-600 text-sm">Active Requests</p>
                    </div>
                    <p className="font-semibold text-violet-900">
                      {userData?.requests?.length || 0}
                    </p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-violet-600" />
                      <p className="text-violet-600 text-sm">Completed</p>
                    </div>
                    <p className="font-semibold text-violet-900">
                      {userData?.completed_requests?.length || 0}
                    </p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-violet-600" />
                      <p className="text-violet-600 text-sm">Points</p>
                    </div>
                    <p className="font-semibold text-violet-900">
                      {userData?.points || 0}
                    </p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-xl">
                    <p className="text-violet-600 text-sm mb-2">Current Tier</p>
                    <p className="font-semibold text-violet-900">
                      {userData?.current_tier}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-violet-800 mb-4">
                  Account Activity
                </h2>
                <div className="bg-violet-50 p-6 rounded-xl">
                  <p className="text-violet-600 mb-2">Last Profile Updated:</p>
                  <p className="font-semibold text-violet-900">
                    {new Date(userData?.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              className="px-6 py-3 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-1/3"
              onClick={handleStatusChange}
            >
              {userData?.status === "active" ? "Block User" : "Unblock User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPart;
