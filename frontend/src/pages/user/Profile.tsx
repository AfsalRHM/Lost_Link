import { useEffect } from "react";
import Hero from "../../components/user/profile-page/Hero";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import getProfile from "../../api/user-api/getProfileAPI";
import { useNavigate } from "react-router-dom";
import userLogout from "../../api/auth-api/userLogoutAPI";
import { useUserJwtErrors } from "../../utils/JwtErrors";

const Profile = () => {
  const { accessToken } = useSelector((state: RootState) => state.accessToken);

  const jwtErrors = useUserJwtErrors();

  const navigate = useNavigate();

  useEffect(() => {
    async function handleProfile() {
      const result = await getProfile();
      if (result.status) {
        navigate("/profile");
      } else {
        jwtErrors({ reason: "session expiration" });
        await userLogout({
          accessToken,
        });
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
