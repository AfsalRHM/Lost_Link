import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

import { adminService } from "../../../services/adminService";

import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";

type User = {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  status: "active" | "inactive";
};

interface UserListPartProps {
  allUsers: User[];
  setUserList: Dispatch<SetStateAction<User[]>>;
}

const UserListPart = ({ allUsers, setUserList }: UserListPartProps) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("userName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDetailsPage = (id: string) => {
    if (id) {
      navigate(`/admin/users/user-details/${id}`);
    }
  };

  const handleStatusChange = async (id: string) => {
    const prevUsers = [...allUsers];

    setUserList(
      allUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
    try {
      const response = await adminService.updateUser({ userId: id });

      showSuccessToast(response.data.message);
    } catch (error) {
      setUserList(prevUsers);
      showErrorToast("Failed to change user status");
    }
  };

  const filteredUsers = allUsers
    .filter(
      (user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const SortIcon = ({ field }: { field: keyof User }) => (
    <span className="inline-block ml-1">
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )
      ) : (
        <ChevronDown size={16} className="text-gray-400" />
      )}
    </span>
  );

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white mb-4 sm:mb-0">
          Users
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-blue-300 text-white"
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
                  onClick={() => handleSort("userName")}
                >
                  Name <SortIcon field="userName" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status <SortIcon field="status" />
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-blue-400 divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-black font-medium">
                          {user.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.userName}
                        </div>
                        <div className="text-sm text-black">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex text-sm font-medium px-2 py-1 rounded ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleStatusChange(user.id)}
                        className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                          user.status == "active"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {user.status == "active" ? "Block" : "Un Block"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleDetailsPage(user.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-5 items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserListPart;
