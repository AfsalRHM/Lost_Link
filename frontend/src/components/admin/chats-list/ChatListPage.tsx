import { useEffect, useState } from "react";
import ChatListPart from "./ChatListPart";
import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";
import fetchAllUsers from "../../../api/admin-api/allUsersAPI";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userList, setUserList] = useState([]);

  const getAllChats = async () => {
    try {
      const response = await fetchAllUsers();
      if (response.status == 200) {
        setUserList(response.data.data);
      } else {
        console.log(response, "this is the error response on getAllChats");
        AdminErrorHandling(response, dispatch, navigate);
      }
    } catch (error) {
      console.error("Error in getAllChats:", error);
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
