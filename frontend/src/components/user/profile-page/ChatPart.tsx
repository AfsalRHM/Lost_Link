import { useState, useRef, useEffect } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import getMyChat from "../../../api/user-api/getChat";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import ChatPartLoading from "./loading/ChatPartLoading";
import saveMessage from "../../../api/user-api/sendMessage";
import IchatModel, { ImessageModel } from "../../../interface/Ichat";
import getAllMessagesOfChat from "../../../api/user-api/getAllMessages";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getNotifSocket, getSocket } from "../../../socket/socket";
import { Trash, X } from "lucide-react";
import ImageUpload from "../../shared/ImageUpload";
import ImageModal from "../../shared/ImageModal";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";
import { useNavigate } from "react-router-dom";

const ChatPart = ({
  onClose,
  requestId,
}: {
  onClose: any;
  requestId: string | undefined;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.userDetails.userId);

  const socket = getSocket();
  const notifSocket = getNotifSocket();

  const [chat, setChat] = useState<IchatModel>();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ImessageModel[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [chatImage, setChatImage] = useState<string>("no image");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initializing the Socket
  useEffect(() => {
    // Join in a room
    socket.emit("setup", userId);
    socket.on("connected", () => true);

    notifSocket.emit("setup", userId); // Change to the whole page
    notifSocket.on("notificationConnected", () => true);

    // return () => socket.disconnect();
  }, [userId]);

  useEffect(() => {
    const getChatData = async () => {
      try {
        const response = await getMyChat({ requestId });
        if (response.status === 200) {
          setChat(response.data.data.chatData);
          getMessages(response.data.data.chatData._id);
        } else {
          console.log(response, "this is the error response on getMyChat");
          UserErrorHandling(response, dispatch, navigate);
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

      socket.emit("joinRoom", chatIdProp);
    } else {
      console.log(
        messagesResponse,
        "this is the error response on getAllMessagesOfChat"
      );
      UserErrorHandling(messagesResponse, dispatch, navigate);
    }
  }

  useEffect(() => {
    socket.on("adminMessageRecieved", (newMessageRecieved) => {
      setMessages([...messages, newMessageRecieved]);
    });
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chat?._id);
    }
  };

  // Send Message
  const sendMessage = async (chatIdProp: string | undefined) => {
    if (!newMessage.trim() && chatImage == "no image") {
      showErrorToast2("Cannot send an empty message.");
      return;
    }

    if (chat) {
      const response = await saveMessage({
        chatId: chatIdProp!,
        content: newMessage,
        image: chatImage,
      });
      if (response.status === 200) {
        socket.emit("newUserMessage", {
          sender: userId,
          chat: chat._id,
          content: newMessage,
          image: chatImage,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        notifSocket.emit("newUserMessage", {
          sender: "user",
          request: requestId,
          chat: chat._id,
          user: userId,
        });
        setMessages([
          ...messages,
          {
            chat: chat._id,
            sender: userId,
            content: newMessage,
            image: chatImage,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        setNewMessage("");
        setChatImage("no image");
        setPreviewImages([]);
      } else {
        console.log(response, "this is the error response on saveMessage");
        UserErrorHandling(response, dispatch, navigate);
      }
    }
  };

  // Remove Specific Image
  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove all images
  const removeAllImages = () => {
    setPreviewImages([]);
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

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-violet-50">
          {messages.map((msg, index) => {
            // Get the date of the current and previous message
            const currentDate = new Date(msg.createdAt).toLocaleDateString();
            const previousDate =
              index > 0
                ? new Date(messages[index - 1].createdAt).toLocaleDateString()
                : null;

            const isOwnMessage = msg.sender === userId;

            return (
              <div key={index}>
                {currentDate !== previousDate && (
                  <div className="text-center text-sm p-2 bg-gray-200 rounded-lg text-gray-500 my-4">
                    {currentDate === new Date().toLocaleDateString()
                      ? "Today"
                      : currentDate}
                  </div>
                )}

                <div
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-sm md:max-w-md break-words whitespace-pre-wrap shadow-sm ${
                        isOwnMessage
                          ? "bg-violet-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <div className="mb-2">{msg.content}</div>

                      {msg.image == "no image" ? null : !msg.image ? null : (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={msg.image}
                            alt="Message attachment"
                            className="w-full max-w-[160px] min-w-[120px] object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                            onClick={() => setSelectedImage(msg.image!)}
                          />
                        </div>
                      )}

                      <p
                        className={`text-xs flex mt-2 ${
                          isOwnMessage
                            ? "text-blue-200 justify-end"
                            : "text-blue-900"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-violet-100 rounded-t-lg shadow-md">
          {previewImages.length > 0 && (
            <div className="relative bg-gray-50 p-3 rounded-xl border border-gray-200 mb-3">
              <button
                onClick={removeAllImages}
                className="absolute -top-0 -right-0 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>

              <div className="flex gap-2 overflow-x-auto">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="w-28 h-28 rounded-lg object-cover border shadow"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-0 -right-0 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition"
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ImageUpload
              setChatImage={setChatImage}
              setPreviewImages={setPreviewImages}
            />

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 p-2 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
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
            Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong>{" "}
            for a new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPart;
