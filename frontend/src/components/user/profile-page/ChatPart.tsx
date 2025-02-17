import { useState, useRef, useEffect } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import getMyChat from "../../../api/user-api/getChat";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import ChatPartLoading from "./loading/ChatPartLoading";
import saveMessage from "../../../api/user-api/sendMessage";
import IchatModel from "../../../interface/Ichat";
import getAllMessagesOfChat from "../../../api/user-api/getAllMessages";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ChatPart = ({
  onClose,
  requestId,
}: {
  onClose: any;
  requestId: string | undefined;
}) => {
  const userId = useSelector((state: RootState) => state.userDetails.userId);

  const [chat, setChat] = useState<IchatModel>();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: "admin",
      content: "Hello! How can I assist you today?",
      createdAt: new Date().toString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getChatData = async () => {
      try {
        const response = await getMyChat({requestId});
        if (response.status === 200) {
          setChat(response.data.data.chatData);
          getMessages(response.data.data.chatData._id);
        } else {
          showErrorToast2(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch Chat:", error);
      }
    };

    getChatData();
  }, []);

  async function getMessages(chatIdProp: string) {
    const messagesResponse = await getAllMessagesOfChat({
      chatId: chatIdProp,
    });

    if (messagesResponse.status === 200) {
      setMessages([...messages, ...messagesResponse.data.data]);
      setLoading(false);
    } else {
      showErrorToast2(messagesResponse.data.message);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chat?._id);
    }
  };

  const sendMessage = async (chatIdProp: string | undefined) => {
    if (newMessage.trim() !== "") {
      if (chat) {
        const response = await saveMessage({
          chatId: chatIdProp!,
          content: newMessage,
        });
        if (response.status === 200) {
          setMessages([
            ...messages,
            {
              sender: userId,
              content: newMessage,
              createdAt: new Date().toString(),
            },
          ]);
          setNewMessage("");
        } else {
          showErrorToast2(response.data.message);
        }
      }
    }
  };

  if (loading) {
    return <ChatPartLoading />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-violet-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${
                  msg.sender === userId ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md ${
                    msg.sender === userId
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

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
              onClick={() => sendMessage(chat?._id)}
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
