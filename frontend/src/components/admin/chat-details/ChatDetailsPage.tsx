import { useEffect, useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import ChatPart from "./ChatPart";
import IchatModel from "../../../interface/Ichat";
import { useParams } from "react-router-dom";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import fetchChatDetails from "../../../api/admin-api/getChatDetails";
import ChatListSkeleton from "./loading/ChatDetailsPageLoadin";
import NavBar from "../shared/Navbar";

const ChatListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();

  const JwtErrors = useAdminJwtErrors();

  const [chatDetails, setChatDetails] = useState<IchatModel>();

  const getChatDetails = async () => {
    try {
      const response = await fetchChatDetails({ chatId: id });
      if (response && response.data && response.data.status) {
        setChatDetails(response.data.data);
        setLoading(false);
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
      console.error("Error in getChatDetails:", error);
    }
  };

  useEffect(() => {
    getChatDetails();
  }, []);

  if (loading) {
    return <ChatListSkeleton />;
  }

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
          {chatDetails ? (
            <ChatPart chatDetails={chatDetails} />
          ) : (
            <div className="text-center">Chat Data not found.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatListPage;
