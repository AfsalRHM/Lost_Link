import { useEffect, useState } from "react";
import ChatListPart from "./ChatListPart";
import { Sidebar } from "../shared/Sidebar";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import NavBar from "../shared/Navbar";
import fetchAllUsers from "../../../api/admin-api/allUsersAPI";

const ChatListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const JwtErrors = useAdminJwtErrors();
  const [userList, setUserList] = useState([]);

  const getAllChats = async () => {
    try {
      const response = await fetchAllUsers();

      if (response && response.data && response.data.status) {
        setUserList(response.data.data);
      } else if (response === false) {
        JwtErrors({ reason: "session expiration" });
        try {
          await adminLogout();
        } catch (logoutError) {
          console.error("Error during admin logout:", logoutError);
        }
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error in getAllAdmins:", error);
    }
  };

  useEffect(() => {
    getAllChats();
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
          <ChatListPart allUsers={userList} />
        </main>
      </div>
    </div>
  );
};

export default ChatListPage;
