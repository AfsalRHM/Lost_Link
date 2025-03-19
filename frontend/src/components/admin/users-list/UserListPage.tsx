import { useEffect, useState } from "react";
import UserListPart from "./UserListPart";
import { Sidebar } from "../shared/Sidebar";
import fetchAllUsers from "../../../api/admin-api/allUsersAPI";
import { showErrorToast } from "../../../utils/toastUtils";
import NavBar from "../shared/Navbar";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const UserListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userList, setUserList] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await fetchAllUsers();

      if (response.status == 200) {
        setUserList(response.data.data);
      } else {
        console.log(response, "this is the error response on fetchAllUsers");
        AdminErrorHandling(response, dispatch, navigate);
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
