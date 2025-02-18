import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";
import { useState } from "react";
import IchatModel from "../../../interface/Ichat";

interface ChatListPartProps {
  allChats: IchatModel[];
}

const ChatListPart = ({ allChats = [] }: ChatListPartProps) => {
  // const { adminAccessToken } = useSelector(
  //   (state: RootState) => state.accessToken
  // );
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof IchatModel>("chat_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page

  const chats: IchatModel[] = allChats || [];

  const handleSort = (field: keyof IchatModel) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDetailsPage = (id: string) => {
    if (id) {
      navigate(`/chat/chat-details`, { state: { chatId: id } });
    }
  };

  const filteredChats = chats
    .filter((chat) =>
      chat.chat_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);
  const currentChats = filteredChats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white mb-4 sm:mb-0">
          Chats
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search Requests/Users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-blue-300 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("chat_name")}
                >
                  Request
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  // onClick={() => handleSort("role")}
                >
                  User
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  // onClick={() => handleSort("status")}
                >
                  Request Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-blue-400 divide-y divide-gray-200">
              {currentChats.map((chat) => (
                <tr key={chat._id} className="hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {chat.chat_name}
                        </div>
                        <div className="text-sm text-black">
                          {chat.latest_message.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex text-sm font-medium px-2 py-1 rounded ${
                        chat.is_group_chat === true
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {chat.is_group_chat}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-sm font-medium">
                      {chat.is_group_chat}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDetailsPage(chat._id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      More...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-5 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChatListPart;
