import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import changeStatus from "../../../api/admin-api/changeUserStatus";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";

interface User {
  _id: string;
  full_name: string;
  user_name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "inactive";
}

interface UserListPartProps {
  allUsers: User[];
  allUsersFunc: () => Promise<void>;
}

const UserListPart = ({ allUsers, allUsersFunc }: UserListPartProps) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("user_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const users: User[] = allUsers;

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
      navigate(`/admin/userdetails`, { state: { userId: id } });
    }
  };

  const handleStatusChange = async (id: string) => {
    const response = await changeStatus({userId: id});
    await allUsersFunc();
    if (response.status) {
      showSuccessToast('User Status Changed')
    } else {
      showErrorToast("User Status not Changed");
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

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
          {/* <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus size={20} className="mr-2" />
            Add User
          </button> */}
        </div>
      </div>

      <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("user_name")}
                >
                  Name <SortIcon field="user_name" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status <SortIcon field="status" />
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Active
                </th> */}
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-blue-400 divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-black font-medium">
                          {user.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.user_name}
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
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {user.lastActive}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleStatusChange(user._id)}
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
                        onClick={() => handleDetailsPage(user._id)}
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
    </div>
  );
};

export default UserListPart;
