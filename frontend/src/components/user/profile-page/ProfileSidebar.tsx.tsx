import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import { removeAccessToken } from "../../../redux/slice/accessTokenSlice";
import { showSuccessToast } from "../../../utils/toastUtils";

const ProfileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logoutFunction() {
    dispatch(removeUserDetails());
    dispatch(removeAccessToken());
    showSuccessToast("Logout successful!");
    navigate("/login");
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
