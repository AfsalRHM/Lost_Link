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

const Profile = () => {
  const { accessToken } = useSelector((state: RootState) => state.accessToken);

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
        console.log("Nothing is getting");
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
