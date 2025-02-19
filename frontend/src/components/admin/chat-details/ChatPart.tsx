import { ArrowLeft, Info, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import IchatModel, { ImessageModel } from "../../../interface/Ichat";
import fetchUserMessages from "../../../api/admin-api/getMessagesAPI";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import saveAdminMessage from "../../../api/admin-api/sendAdminMessage";

const ChatPart = ({ chatDetails }: { chatDetails: IchatModel | undefined }) => {
  const navigate = useNavigate();

  const { adminId } = useSelector((state: RootState) => state.adminDetails);

  console.log(chatDetails);

  const [messages, setMessages] = useState<ImessageModel[]>([]);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetchUserMessages({ chatId: chatDetails?._id });
        if (response.status === 200) {
          setMessages([...messages, ...response.data.data]);
        } else {
          showErrorToast2(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch Chat:", error);
      }
    };

    getMessages();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUserDetails = () => {
    navigate("/users/details", { state: { userId: chatDetails?.user_id } });
  };

  const handleRequestDetails = () => {
    navigate("/requests/details", {
      state: { requestId: chatDetails?.request_id },
    });
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      if (chatDetails) {
        const response = await saveAdminMessage({
          chatId: chatDetails._id,
          content: newMessage,
        });
        if (response.status === 200) {
          setMessages([
            ...messages,
            {
              sender: adminId,
              chat: chatDetails._id,
              content: newMessage,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
          setNewMessage("");
        } else {
          showErrorToast2(response.data.message);
        }
      }
    }
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white flex flex-col">
      <div className="mb-6 flex items-center">
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded-full bg-blue-700 hover:bg-blue-600 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">
          Chat with {chatDetails?.user_name}
        </h1>
      </div>

      <div className="bg-blue-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-medium">Chat Information</h2>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-flex text-sm font-medium px-3 py-1 rounded-full ${
                chatDetails?.request_status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-pink-800"
              }`}
            >
              {chatDetails?.request_status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">User</h3>
              <button
                onClick={handleUserDetails}
                className="flex items-center gap-1 text-sm text-blue-300 hover:text-blue-100"
              >
                <Info size={16} />
                Details
              </button>
            </div>
            <p className="text-lg">{chatDetails?.user_name}</p>
          </div>

          <div className="bg-blue-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Request</h3>
              <button
                onClick={handleRequestDetails}
                className="flex items-center gap-1 text-sm text-blue-300 hover:text-blue-100"
              >
                <Info size={16} />
                Details
              </button>
            </div>
            <p className="text-lg">{chatDetails?.request_name}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-800 rounded-lg shadow flex-grow flex flex-col">
        <div className="p-4 border-b border-blue-700">
          <h2 className="text-xl font-medium">Messages</h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === adminId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.sender === adminId
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-blue-400 text-black rounded-tl-none"
                } shadow-md`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === adminId
                      ? "text-blue-200"
                      : "text-blue-900"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-blue-700 flex"
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-300 text-black"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg px-4 py-2 flex items-center transition-colors"
          >
            <Send size={20} className="mr-2" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPart;
