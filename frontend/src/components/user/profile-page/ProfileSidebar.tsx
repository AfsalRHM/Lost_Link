import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import { removeAccessToken } from "../../../redux/slice/accessTokenSlice";
import {
  showErrorToast,
  showLogoutConfirmation,
  showSuccessToast,
} from "../../../utils/toastUtils";
import userLogout from "../../../api/auth-api/userLogoutAPI";

const ProfileSidebar = ({
  selectFunction,
  selectedItem,
}: {
  selectFunction: React.Dispatch<React.SetStateAction<string>>;
  selectedItem: string;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function logoutFunction() {
    try {
      await userLogout();

      dispatch(removeUserDetails());
      dispatch(removeAccessToken());
      showSuccessToast("Logout successful!");
      navigate("/signin");
    } catch (error) {
      console.log("Error on the logoutFunction:", error);
      showErrorToast("Error while logging out...!");
    }
  }

  const onLogoutClick = () => {
    showLogoutConfirmation("Are you sure you want to log out?", logoutFunction);
  };

  function goToPage(currentValue: string) {
    selectFunction(currentValue);
    console.log(currentValue);
  }

  const menuItems = [
    // "Location Info",
    "My Wallet",
    "My Requests",
    "My Reports",
    "Meetings",
    "Tier Information",
    "Redeem Requests",
    "Logout",
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="font-bold text-gray-700 text-lg mb-4">Profile Info</h3>
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`
              p-3 rounded-md cursor-pointer transition-all 
              ${
                item === selectedItem
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:shadow-md"
              } 
              ${item === "Logout" && "bg-red-400 text-white hover:bg-red-500"} 
            `}
            onClick={() => {
              if (item === "Logout") {
                onLogoutClick();
              } else {
                goToPage(item);
              }
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
