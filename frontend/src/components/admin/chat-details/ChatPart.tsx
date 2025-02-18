import { ArrowLeft, Info, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import IchatModel from "../../../interface/Ichat";

interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  content: string;
  timestamp: string;
}

const ChatPart = ({ chatDetails }: { chatDetails: IchatModel | undefined }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatId = location.state?.chatId;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log("Fetching details for chat ID:", chatId);
  }, [chatId]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg: ChatMessage = {
      id: (messages.length + 1).toString(),
      sender: "admin",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.sender === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-400 text-black"
                } shadow-md`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "admin"
                      ? "text-blue-200"
                      : "text-blue-900"
                  }`}
                >
                  {formatDate(message.timestamp)}
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
