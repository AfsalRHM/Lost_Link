import React, { useEffect, useState } from "react";
import { BarChart, Activity, Users, X, Notebook, LogOut } from "lucide-react";
import { SidebarProps } from "../../../interface/IadminDashboard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeAdminDetails } from "../../../redux/slice/adminDetailsSlice";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { RootState } from "../../../redux/store";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { removeAdminAccessToken } from "../../../redux/slice/accessTokenSlice";

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { adminAccessToken } = useSelector(
    (state: RootState) => state.accessToken
  );

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    try {
      const result = await adminLogout({
        accessToken: adminAccessToken,
        navigate,
      });
      if (result.data.status == "true") {
        dispatch(removeAdminDetails());
        dispatch(removeAdminAccessToken());
        showSuccessToast("Logout successful!");
        navigate("/admin/login");
      } else {
        showErrorToast("Logout Failed..!");
      }
    } catch (error) {
      console.log("Error on the logoutFunction :", error);
      showErrorToast("Error while loggin out...!");
    }
  };

  const navItems = [
    { text: "Dashboard", icon: <BarChart size={20} />, path: "/admin" },
    {
      text: "Analytics",
      icon: <Activity size={20} />,
      path: "/admin/analytics",
    },
    { text: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { text: "Admins", icon: <Users size={20} />, path: "/admin/admins" },
    { text: "Requests", icon: <Notebook size={20} />, path: "/admin/requests" },
    { text: "Logout", icon: <LogOut size={20} />, path: "/" },
  ];

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:relative top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="flex justify-between items-center p-6 border-b border-blue-700">
        <h1 className="text-xl font-bold">
          <span className="underline">Lost Link</span>
          <br />
          &nbsp;&nbsp;&nbsp;Analytics Hub
        </h1>
        <button onClick={toggle} className="lg:hidden">
          <X size={24} />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              {item.text === "Logout" ? (
                <div
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-700"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ) : (
                <Link to={item.path}>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      currentLocation === item.path
                        ? "bg-blue-700"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
