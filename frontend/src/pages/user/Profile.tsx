import { useEffect } from "react";
import Hero from "../../components/user/profile-page/Hero";
import Footer from "../../components/user/shared/Footer";
import Header from "../../components/user/shared/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import getProfile from "../../api/user-api/getProfileAPI";
import { useNavigate } from "react-router-dom";
import { assignAccessToken } from "../../redux/slice/accessTokenSlice";
import { removeUserDetails } from "../../redux/slice/userDetailsSlice";
import userLogout from "../../api/auth-api/userLogoutAPI";
import { useUserJwtErrors } from "../../utils/JwtErrors";

const Profile = () => {
  const { accessToken } = useSelector((state: RootState) => state.accessToken);

  const jwtErrors = useUserJwtErrors();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function handleProfile() {
      const result = await getProfile({
        accessToken,
        navigate,
        setAccessToken: assignAccessToken,
        dispatch,
        removeUserDetails: removeUserDetails,
      });
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
