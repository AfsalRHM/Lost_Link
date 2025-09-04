import { useCallback, useEffect, useState } from "react";

import { adminService } from "../../../services/adminService";

type Request = {
  id: string;
  productName: string;
  productCategory: string;
  status: string;
  rewardAmount: number;
  createdAt: Date;
};

import { Sidebar } from "../shared/Sidebar";
import RequestListPart from "./RequestListPart";
import NavBar from "../shared/Navbar";
import { Search } from "lucide-react";

import RequestListPartLoading from "./loading/RequestListPartLoading";

const RequestListPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestList, setRequestList] = useState<Request[]>([]);
  const [filterData, setFilterData] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 2;

  const fetchRequests = useCallback(
    async (page = 1, search = "") => {
      try {
        const { data } = await adminService.getRequests({
          page,
          limit: itemsPerPage,
          search,
        });

        if (data.status) {
          setRequestList(data.data.data);
          setFilterData({
            totalItems: data.data.totalItems,
            totalPages: data.data.totalPages,
          });
          setCurrentPage(data.data.currentPage);
        }
      } catch (error) {
        console.error("Error in fetchRequests:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= filterData.totalPages) {
      fetchRequests(page, searchTerm);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRequests(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchRequests]);

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
                Requests
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search Requests..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-blue-300 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <RequestListPartLoading />
            ) : (
              <RequestListPart
                allRequests={requestList}
                setRequestList={setRequestList}
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

export default RequestListPage;
