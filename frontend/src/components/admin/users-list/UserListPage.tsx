import { useEffect, useState } from "react";
import UserListPart from "./UserListPart";
import { Sidebar } from "../shared/Sidebar";
import fetchAllUsers from "../../../api/admin-api/allUsersAPI";
import { showErrorToast } from "../../../utils/toastUtils";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import NavBar from "../shared/Navbar";

const UserListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const JwtErrors = useAdminJwtErrors();

  const getAllUsers = async () => {
    try {
      const response = await fetchAllUsers();
      if (response && response.data && response.data.status) {
        setUserList(response.data.data);
      } else if (response === false) {
        JwtErrors({ reason: "session expiration" });
        await adminLogout();
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      showErrorToast("An unexpected error occurred while fetching users");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-blue-800 shadow-md z-10 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64">
        <NavBar setSidebarOpen={setSidebarOpen} />

        <main className="p-6">
          <UserListPart allUsers={userList} allUsersFunc={getAllUsers} />
        </main>
      </div>
    </div>
  );
};

export default UserListPage;
