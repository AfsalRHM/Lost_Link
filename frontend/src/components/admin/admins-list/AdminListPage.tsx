import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { adminService } from "../../../services/adminService";

import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";
import AdminListPart from "./AdminListPart";

import AdminListPartLoading from "./loading/AdminListPartLoading";

import { Search, UserPlus } from "lucide-react";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

const AdminListPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterData, setFilterData] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 2;

  const fetchAdmins = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      try {
        const { data } = await adminService.getAdmins({
          page,
          limit: itemsPerPage,
          search,
        });

        if (data.status) {
          setAdminList(data.data.admins);
          setFilterData({
            totalItems: data.data.totalItems,
            totalPages: data.data.totalPages,
          });
          setCurrentPage(data.data.currentPage);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= filterData.totalPages) {
      fetchAdmins(page, searchTerm);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAdmins(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchAdmins]);

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-blue-800 shadow-md z-10 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64">
        <NavBar setSidebarOpen={setSidebarOpen} />

        <main className="p-6">
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
                    placeholder="Search admins..."
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

            {loading ? (
              <AdminListPartLoading />
            ) : (
              <AdminListPart
                allAdmins={adminList}
                setAdminList={setAdminList}
              />
            )}

            <div className="mt-4 flex justify-center gap-5 items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {filterData.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === filterData.totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminListPage;
