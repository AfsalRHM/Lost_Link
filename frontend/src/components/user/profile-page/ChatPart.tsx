import { useState, useRef, useEffect } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import getMyChat from "../../../api/user-api/getChat";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import ChatPartLoading from "./loading/ChatPartLoading";

const ChatPart = ({ onClose }: { onClose: any }) => {
  const [chat, setChat] = useState();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: "admin",
      text: "Hello! How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getRequestData = async () => {
      try {
        const response = await getMyChat();
        if (response.status === 200) {
          console.log(response, "This is the Chat data of the user");
          setChat(response.data.data);
        } else {
          showErrorToast2(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequestData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          sender: "user",
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <ChatPartLoading />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-violet-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-violet-600 font-semibold">A</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-violet-800">
                Chat with Admin
              </h2>
              <p className="text-sm text-violet-500">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-violet-400 hover:text-violet-600 hover:bg-violet-50 p-2 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-violet-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md ${
                    msg.sender === "user"
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-violet-100">
          <div className="flex items-center gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-violet-600 text-white p-3 rounded-xl hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <IoSend size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPart;
