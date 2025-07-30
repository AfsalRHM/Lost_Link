import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userService } from "../../../services/userService.ts";

import LocationInfo from "./LocationInfo";
import ProfileSidebar from "./ProfileSidebar.tsx";
import TierSection from "./TierSection";
import UserDetails from "./UserDetails";
import VerifyButton from "./VerifyButton";
import MyRequests from "./MyRequests.tsx";
import RedeemRequests from "./RedeemRequests.tsx";
import TierInfo from "./TierInfo.tsx";
import ReportList from "./ReportList.tsx";
import WalletSection from "./WalletSection.tsx";
import MeetingSection from "./MeetingSection.tsx";

import UserDetailsLoading from "./loading/UserDetailsLoading.tsx";
import TierSectionLoading from "./loading/TierSectionLoading.tsx";

import UserErrorHandling from "../../../middlewares/UserErrorHandling.tsx";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState();
  const [selectedItem, setSelectedItem] = useState<string>("My Wallet");

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await userService.getProfile();

        if (response.status == 200) {
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
              <RedeemRequests />
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
