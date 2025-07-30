import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import { MessageCircle, Send, User, Bot } from "lucide-react";
import { chatWithBot } from "../../../utils/chatBot";
import ReactMarkdown from "react-markdown";
import { RootState } from "../../../redux/store";

const BotComponent = () => {
  const userData = useSelector((state: RootState) => state.userDetails);

  const [question, setQuestion] = useState<string>("");
  const [chats, setChats] = useState<
    Array<{
      id: number;
      type: "user" | "bot";
      message: string;
    }>
  >([]);
  const [replyLoading, setReplyLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setReplyLoading(true);

    const newUserChat = {
      id: chats.length + 1,
      type: "user" as const,
      message: question,
    };

    setChats((prevChats) => [...prevChats, newUserChat]);
    setQuestion("");

    try {
      const botResponse = await chatWithBot({ message: question });

      const newBotChat = {
        id: chats.length + 2,
        type: "bot" as const,
        message: botResponse,
      };

      setChats((prevChats) => [...prevChats, newBotChat]);
    } catch (error) {
      console.error("Error getting bot response:", error);

      const errorChat = {
        id: chats.length + 2,
        type: "bot" as const,
        message:
          "Sorry, I couldn't process your request. Please try again later.",
      };

      setChats((prevChats) => [...prevChats, errorChat]);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg">
        <MessageCircle size={24} />
      </div>

      <div className="text-center mb-6 pt-4">
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-4">
          Our support bot is ready to help you!
        </p>
      </div>

      <div
        ref={chatContainerRef}
        className="bg-gray-50 rounded-lg p-4 mb-4 h-80 overflow-y-auto"
      >
        {chats.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">No messages yet. Ask me anything!</p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${
                  chat.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start ${
                    chat.type === "user" ? "flex-row-reverse" : "flex-row"
                  } ${
                    chat.type === "bot"
                      ? "max-w-3/4 w-3/4"
                      : "max-w-xs md:max-w-md"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      chat.type === "user"
                        ? "bg-indigo-100 ml-2"
                        : "bg-gray-200 mr-2"
                    }`}
                  >
                    {chat.type === "user" ? (
                      userData.userName !== "" ? (
                        <img
                          src={userData.userProfile}
                          alt="User"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User size={16} className="text-indigo-600" />
                      )
                    ) : (
                      <Bot size={16} className="text-gray-600" />
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      chat.type === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-white shadow-sm border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    {chat.type === "user" ? (
                      <div className="text-white">{chat.message}</div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="text-gray-700 mb-2" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-bold text-gray-800"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc list-inside my-2"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              className="ml-2 text-gray-700 mb-1"
                              {...props}
                            />
                          ),
                          a: ({ node, ...props }) => (
                            <a
                              className="text-indigo-600 hover:underline"
                              {...props}
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {chat.message}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {replyLoading && (
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <Bot size={16} className="text-gray-400" />
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={replyLoading}
        />
        <button
          type="submit"
          className={`px-4 py-3 rounded-r-lg flex items-center justify-center transition-colors duration-300 ${
            replyLoading || !question.trim()
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
          disabled={replyLoading || !question.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default BotComponent;
