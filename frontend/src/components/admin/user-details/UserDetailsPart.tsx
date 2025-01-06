import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userDataType } from "../../../interface/IuserModel";

const UserDetailsPart = () => {
  const location = useLocation();
  const state = location.state as { userId?: string };
  const userId = state?.userId;

  const [user, setUser] = useState<userDataType | undefined>(undefined);

  useEffect(() => {
    // call the api here
    if (userId) {
      const userData = {
        full_name: "John Doe",
        user_name: "john_doe",
        location: "New York, USA",
        email: "john.doe@example.com",
        password: "securepassword123", // Note: Do not display passwords in production
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(userData);
    }
  }, [userId]);

  return (
    <div className="p-8 bg-blue-670 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold mb-8 text-center underline">User Details</h1>

        {/* Card Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            {/* User Avatar */}
            <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user?.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            {/* User Info */}
            <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-2">{user?.full_name}</h2>
              <p className="text-gray-400 text-lg">@{user?.user_name}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="border-t border-gray-700 pt-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-blue-400">Location:</h3>
              <p className="text-gray-300 text-lg">{user?.location}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-blue-400">Email:</h3>
              <p className="text-gray-300 text-lg">{user?.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-blue-400">
                Account Created:
              </h3>
              <p className="text-gray-300 text-lg">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-400">
                Last Updated:
              </h3>
              <p className="text-gray-300 text-lg">
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
            Edit Details
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg">
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPart;
