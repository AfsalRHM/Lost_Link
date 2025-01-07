import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import { removeAccessToken } from "../../../redux/slice/accessTokenSlice";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import userLogout from "../../../api/auth-api/userLogoutAPI";
import { RootState } from "../../../redux/store";

const ProfileSidebar = () => {
  const { accessToken } = useSelector((state: RootState) => state.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function logoutFunction() {
    try {
      const result = await userLogout({
        accessToken,
        navigate,
      });
      if (result.data.status == "true") {
        dispatch(removeUserDetails());
        dispatch(removeAccessToken());
        showSuccessToast("Logout successful!");
        navigate("/signin");
      } else {
        showErrorToast("Logout Failed..!");
      }
    } catch (error) {
      console.log("Error on the logoutFunction :", error);
      showErrorToast("Error while loggin out...!");
    }
  }

  function goToPage(currentValue: string) {
    console.log(currentValue);
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="font-bold text-gray-700 text-lg mb-4">Profile Info</h3>
      <ul className="space-y-3">
        {[
          "Location Info",
          "Tier Information",
          "My Requests",
          "Completed Requests",
          "Payment History",
          "Logout",
        ].map((item, index) => (
          <li
            key={index}
            className={`p-3 hover:bg-blue-50 hover:shadow-md rounded-md text-gray-700 cursor-pointer transition-all${
              index == 5 ? "bg-red-400 hover:text-red-500" : "bg-gray-100"
            }`}
            onClick={() => {
              index == 5 ? logoutFunction() : goToPage(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileSidebar;
