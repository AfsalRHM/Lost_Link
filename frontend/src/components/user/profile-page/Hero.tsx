import LocationInfo from "./LocationInfo";
import ProfileSidebar from "./ProfileSidebar.tsx";
import TierSection from "./TierSection";
import UserDetails from "./UserDetails";
import VerifyButton from "./VerifyButton";

const Hero = () => (
  <div className="bg-gray-100 min-h-screen py-10 px-4">
    <div className="flex flex-col md:flex-col gap-8 max-w-7xl mx-auto items-center bg-gray-200 rounded-xl">
      <div className="w-full md:w-4/6 mt-12">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <UserDetails />
          <TierSection />
          <VerifyButton />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:w-4/6 gap-5 mb-24 w-full">
        <div className="md:w-80">
          <ProfileSidebar />
        </div>

        <div className="w-full">
          <LocationInfo />
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
