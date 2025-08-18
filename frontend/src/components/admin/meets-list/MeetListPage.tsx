import { useCallback, useEffect, useState } from "react";

import { adminService } from "../../../services/adminService";

import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";
import MeetListPart from "./MeetListPart";

import MeetListPartLoading from "./loading/MeetListPartLoading";
import { Search } from "lucide-react";

const MeetListPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [meetList, setMeetList] = useState([]);
  const [filterData, setFilterData] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 2;

  const fetchMeets = useCallback(
    async (page = 1, search = "", activeTab = "upcoming") => {
      setLoading(true);
      try {
        const { data } = await adminService.getMeets({
          page,
          limit: itemsPerPage,
          search,
          activeTab,
        });

        if (data.status) {
          setMeetList(data.data.data);
          setFilterData({
            totalItems: data.data.totalItems,
            totalPages: data.data.totalPages,
          });
          setCurrentPage(data.data.currentPage);
        }
      } catch (error) {
        console.error("Error in getAllMeets:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  function handleStatusFilter(status: string) {
    setActiveTab(status);
    fetchMeets(1, searchTerm, status);
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= filterData.totalPages) {
      fetchMeets(page, searchTerm, activeTab);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMeets(1, searchTerm, activeTab);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchMeets]);

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
          <div className="bg-blue-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Scheduled Meetings
              </h2>

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

              <div className="flex bg-blue-900 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "text-blue-300 hover:text-white"
                  }`}
                  onClick={() => handleStatusFilter("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === "finished"
                      ? "bg-blue-600 text-white"
                      : "text-blue-300 hover:text-white"
                  }`}
                  onClick={() => handleStatusFilter("finished")}
                >
                  Finished
                </button>
              </div>
            </div>

            {loading ? (
              <MeetListPartLoading />
            ) : (
              <MeetListPart allMeets={meetList} activeTab={activeTab} />
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

export default MeetListPage;
