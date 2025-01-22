import { Search, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { showSuccessToast } from "../../../utils/toastUtils";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import changeAdminStatus from "../../../api/admin-api/changeAdminStatus";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

interface AdminListPartProps {
  allAdmins: Admin[];
  allAdminsFunc: () => Promise<void>;
}

const AdminListPart = ({
  allAdmins = [],
  allAdminsFunc,
}: AdminListPartProps) => {
  const { adminAccessToken } = useSelector(
    (state: RootState) => state.accessToken
  );
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Admin>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page

  const admins: Admin[] = allAdmins || [];

  const handleSort = (field: keyof Admin) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDetailsPage = (id: string) => {
    if (id) {
      navigate(`/admin/userdetails`, { state: { adminId: id } });
    }
  };

  const JwtErrors = useAdminJwtErrors();

  const handleStatusChange = async (id: string) => {
    const response = await changeAdminStatus({ adminId: id });
    await allAdminsFunc();
    if (response.status) {
      showSuccessToast("Admin Status Changed");
    } else if (response === false) {
      JwtErrors({ reason: "session expiration" });
      await adminLogout({
        accessToken: adminAccessToken,
      });
    } else {
      console.log("Unexpected response:", response);
    }
  };

  const filteredAdmins = admins
    .filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const currentAdmins = filteredAdmins.slice(
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
          Admins
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
          <Link to="/admin/addadmin">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus size={20} className="mr-2" />
              Add Admin
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role
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
              {currentAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-blue-700">
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
                      onClick={() => handleStatusChange(admin._id)}
                      className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                        admin.status === "active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {admin.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDetailsPage(admin._id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Details
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

export default AdminListPart;
