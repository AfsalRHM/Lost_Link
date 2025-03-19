import { useEffect, useState } from "react";
import LocationInfo from "./LocationInfo";
import ProfileSidebar from "./ProfileSidebar.tsx";
import TierSection from "./TierSection";
import UserDetails from "./UserDetails";
import VerifyButton from "./VerifyButton";
import MyRequests from "./MyRequests.tsx";
import RedeemRequests from "./RedeemRequests.tsx";
import TierInfo from "./TierInfo.tsx";
import { useDispatch } from "react-redux";
import { assignAccessToken } from "../../../redux/slice/accessTokenSlice.ts";
import getProfile from "../../../api/user-api/getProfileAPI.ts";
import UserDetailsLoading from "./loading/UserDetailsLoading.tsx";
import TierSectionLoading from "./loading/TierSectionLoading.tsx";
import ReportList from "./ReportList.tsx";
import WalletSection from "./WalletSection.tsx";
import MeetingSection from "./MeetingSection.tsx";
import UserErrorHandling from "../../../middlewares/UserErrorHandling.tsx";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState();
  const [selectedItem, setSelectedItem] = useState<string>("Location Info");

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await getProfile();
        if (response.status == 200) {
          const newAccessToken =
            response.headers["authorization"].split(" ")[1];
          dispatch(assignAccessToken(newAccessToken));
          setUserData(response.data.data);
        } else {
          console.log(response, "this is the error response on getProfile");
          UserErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  if (loading)
    return (
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <div className="flex flex-col md:flex-col gap-8 max-w-7xl mx-auto items-center bg-gray-200 rounded-xl">
          <div className="w-full md:w-4/6 mt-12">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <UserDetailsLoading />
              <TierSectionLoading />
              <VerifyButton />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:w-4/6 gap-5 mb-24 w-full">
            <div className="md:w-80">
              <ProfileSidebar
                selectFunction={setSelectedItem}
                selectedItem={selectedItem}
              />
            </div>

            <div className="w-full">
              <LocationInfo />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="flex flex-col md:flex-col gap-8 max-w-7xl mx-auto items-center bg-gray-200 rounded-xl">
        <div className="w-full md:w-4/6 mt-12">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <UserDetails userData={userData} />
            <TierSection userData={userData} />
            {/* <VerifyButton /> */}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:w-4/6 gap-5 mb-24 w-full">
          <div className="md:w-80">
            <ProfileSidebar
              selectFunction={setSelectedItem}
              selectedItem={selectedItem}
            />
          </div>

          <div className="w-full">
            {selectedItem === "Location Info" ? (
              <LocationInfo />
            ) : selectedItem === "My Requests" ? (
              <MyRequests userData={userData} />
            ) : selectedItem === "Redeem Requests" ? (
              <RedeemRequests userData={userData} />
            ) : selectedItem === "Tier Information" ? (
              <TierInfo userData={userData} />
            ) : selectedItem === "My Reports" ? (
              <ReportList userData={userData!} />
            ) : selectedItem === "My Wallet" ? (
              <WalletSection userData={userData} />
            ) : selectedItem === "Meetings" ? (
              <MeetingSection />
            ) : (
              <LocationInfo />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
