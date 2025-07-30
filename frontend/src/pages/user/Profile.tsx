import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { userService } from "../../services/userService";

import Hero from "../../components/user/profile-page/Hero";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";
import { useUserJwtErrors } from "../../utils/JwtErrors";

const Profile = () => {
  const jwtErrors = useUserJwtErrors();

  const navigate = useNavigate();

  useEffect(() => {
    async function handleProfile() {
      const result = await userService.getProfile();
      if (result.status) {
        navigate("/profile");
      } else {
        jwtErrors({ reason: "session expiration" });
        await userService.logout();
      }
    }
    handleProfile();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <Footer />
    </>
  );
};

export default Profile;
