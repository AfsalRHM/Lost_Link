import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import fetchUserChats from "../../../api/admin-api/getUserChats";
import ChatListSkeleton from "./loading/ChatDetailsPageLoadin";
import ChatPart from "./ChatPart";
import NavBar from "../shared/Navbar";
import IchatModel from "../../../interface/Ichat";
import { Sidebar } from "../shared/Sidebar";
import { ArrowLeft } from "lucide-react";

const ChatListPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<IchatModel[]>([]);
  const [selectedChat, setSelectedChat] = useState<IchatModel | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { userId } = useParams<{ userId: string }>();
  const JwtErrors = useAdminJwtErrors();

  const getUserChats = async () => {
    try {
      const response = await fetchUserChats({ userId });
      if (response && response.data && response.data.status) {
        setChats(response.data.data);
        setLoading(false);
        if (response.data.data.length !== 0) {
          setSelectedChat(response.data.data[0]);
        }
      } else if (response === false) {
        JwtErrors({ reason: "session expiration" });
        await adminLogout();
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  useEffect(() => {
    getUserChats();
  }, [userId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="flex h-screen bg-blue-900 text-white">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 shadow-md z-20 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col lg:ml-64">
        <NavBar setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 shadow-xl p-5 flex flex-col rounded-r-lg border-r border-blue-700">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-full bg-blue-700 hover:bg-blue-600 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold border-b border-blue-700 text-blue-100 pb-2">
                {selectedChat?.user_name
                  ? `${selectedChat.user_name.split(" ")[0]}'s Chats`
                  : "User Chats"}
              </h2>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 mt-2">
              {chats.length > 0 ? (
                <ul className="space-y-2">
                  {chats.map((chat) => (
                    <li
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                        selectedChat?._id === chat._id
                          ? "bg-blue-600 shadow-md border-l-4 border-blue-400"
                          : "hover:bg-blue-700 hover:border-l-4 hover:border-blue-500"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                        <div className="truncate font-medium text-blue-100">
                          {chat.request_name.length > 20
                            ? `${chat.request_name.substring(0, 20)}...`
                            : chat.request_name}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-blue-300">
                  No chats available
                </div>
              )}
            </div>
          </div>

          <main className="flex-1 p-6 overflow-auto">
            {selectedChat ? (
              <ChatPart chatDetails={selectedChat} />
            ) : (
              <div className="text-center">Select a chat from the list.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
