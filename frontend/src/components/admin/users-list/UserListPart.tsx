import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

import { adminService } from "../../../services/adminService";

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

      if (response.status) {
        showSuccessToast(response.data.message);
      }
    } catch (error) {
      setUserList(prevUsers);
      showErrorToast("Failed to change user status");
    }
  };

  return (
    <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                Status
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
            {allUsers.map((user) => (
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
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
  );
};

export default UserListPart;
