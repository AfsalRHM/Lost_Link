import { Info, Send, Trash, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent, useRef } from "react";
import IchatModel, { ImessageModel } from "../../../interface/Ichat";
import fetchUserMessages from "../../../api/admin-api/getMessagesAPI";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import saveAdminMessage from "../../../api/admin-api/sendAdminMessage";
import { getNotifSocket, getSocket } from "../../../socket/socket";
import ImageModal from "../../shared/ImageModal";
import ImageUpload from "../../shared/ImageUpload";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";

const ChatPart = ({ chatDetails }: { chatDetails: IchatModel | undefined }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { adminId } = useSelector((state: RootState) => state.adminDetails);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [chatImage, setChatImage] = useState<string>("no image");

  const [messages, setMessages] = useState<ImessageModel[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const socket = getSocket();
  const notifSocket = getNotifSocket();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit("joinRoom", chatDetails?._id);

    const getMessages = async () => {
      try {
        const response = await fetchUserMessages({ chatId: chatDetails?._id });
        if (response.status == 200) {
          setMessages(response.data.data);
        } else {
          console.log(response, "this is the error response on getMessages");
          AdminErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Failed to fetch Chat:", error);
      }
    };

    setMessages([]);
    getMessages();
  }, [chatDetails]);

  useEffect(() => {
    socket.on("userMessageRecieved", (newMessageRecieved) => {
      setMessages([...messages, newMessageRecieved]);
    });
  });

  const handleUserDetails = () => {
    navigate(`/admin/users/user-details/${chatDetails?.user_id}`);
  };

  const handleRequestDetails = () => {
    navigate(`/admin/requests/request-details/${chatDetails?.request_id}`);
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newMessage.trim() && chatImage == "no image") {
      showErrorToast2("Cannot send an empty message.");
      return;
    }

    if (chatDetails) {
      const response = await saveAdminMessage({
        chatId: chatDetails._id,
        content: newMessage,
        image: chatImage,
      });
      if (response.status === 200) {
        socket.emit("newAdminMessage", {
          sender: adminId,
          chat: chatDetails._id,
          content: newMessage,
          image: chatImage,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        notifSocket.emit("newAdminMessage", {
          sender: "admin",
          user: chatDetails.user_id,
          chat: chatDetails._id,
          request: chatDetails.request_id,
        });
        setMessages([
          ...messages,
          {
            sender: adminId,
            chat: chatDetails._id,
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
        console.log(response, "this is the error response on saveAdminMessage");
        AdminErrorHandling(response, dispatch, navigate);
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

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white flex flex-col">
      <div className="bg-blue-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-medium underline">Chat Information</h2>
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

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}

        <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px]">
          {messages.map((message, index) => {
            const currentDate = new Date(
              message.createdAt
            ).toLocaleDateString();
            const previousDate =
              index > 0
                ? new Date(messages[index - 1].createdAt).toLocaleDateString()
                : null;

            return (
              <div key={index}>
                {currentDate !== previousDate && (
                  <div className="text-center text-sm text-white underline rounded-lg">
                    {currentDate == new Date().toLocaleDateString()
                      ? "Today"
                      : currentDate}
                  </div>
                )}

                <div
                  className={`flex ${
                    message.sender === adminId || message.sender === "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-sm md:max-w-2xl break-words whitespace-pre-wrap ${
                      message.sender === adminId || message.sender === "admin"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-blue-400 text-black rounded-tl-none"
                    }`}
                  >
                    <p>{message.content}</p>

                    {!message.image
                      ? null
                      : message.image !== "no image" && (
                          <div className="rounded-lg overflow-hidden mt-1">
                            <img
                              src={message.image}
                              alt="Message attachment"
                              className="w-full max-w-[160px] min-w-[120px] object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                              loading="lazy"
                              onClick={() => setSelectedImage(message.image!)}
                            />
                          </div>
                        )}

                    <p
                      className={`text-xs mt-1 ${
                        message.sender === adminId || message.sender === "admin"
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
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

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

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-blue-700 flex"
        >
          <ImageUpload
            setChatImage={setChatImage}
            setPreviewImages={setPreviewImages}
          />
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
