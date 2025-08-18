import { Dispatch, SetStateAction } from "react";

import { adminService } from "../../../services/adminService";

import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

interface AdminListPartProps {
  allAdmins: Admin[];
  setAdminList: Dispatch<SetStateAction<Admin[]>>;
}

const AdminListPart = ({ allAdmins, setAdminList }: AdminListPartProps) => {
  const handleStatusChange = async (id: string) => {
    const previousData = [...allAdmins];
    setAdminList(
      allAdmins.map((admin) =>
        admin.id === id
          ? {
              ...admin,
              status: admin.status === "active" ? "inactive" : "active",
            }
          : admin
      )
    );

    try {
      const response = await adminService.updateAdmin({ adminId: id });
      if (response.status) {
        showSuccessToast("Admin Status Changed");
      }
    } catch (error) {
      setAdminList(previousData);
      showErrorToast("Failed to update admin status");
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
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer">
                Role
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-blue-400 divide-y divide-gray-200">
            {allAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-blue-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {admin.name}
                      </div>
                      <div className="text-sm text-black">{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex text-sm font-medium px-2 py-1 rounded ${
                      admin.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {admin.status.charAt(0).toUpperCase() +
                      admin.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex text-sm font-medium">
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleStatusChange(admin.id)}
                    className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                      admin.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {admin.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminListPart;
