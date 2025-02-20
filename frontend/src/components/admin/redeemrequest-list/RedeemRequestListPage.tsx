import { useEffect, useState } from "react";
import RedeemRequestListPart from "./RedeemRequestListPart";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { showErrorToast } from "../../../utils/toastUtils";
import { Sidebar } from "../shared/Sidebar";
import { Bell, Menu, Search } from "lucide-react";
import fetchAllRedeemRequests from "../../../api/admin-api/allRedeemRequestsAPI";

const RedeemRequestListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [redeemRequestList, setRedeemRequestList] = useState([]);
  const JwtErrors = useAdminJwtErrors();

  const getAllRedeemRequests = async () => {
    try {
      const response = await fetchAllRedeemRequests();
      if (response && response.data && response.data.status) {
        setRedeemRequestList(response.data.data);
      } else if (response === false) {
        JwtErrors({ reason: "session expiration" });
        await adminLogout();
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error in getAllRedeemRequests:", error);
      showErrorToast(
        "An unexpected error occurred while fetching Redeem Requests"
      );
    }
  };

  useEffect(() => {
    getAllRedeemRequests();
  }, []);

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
        <header className="sticky top-0 z-20 bg-blue-800 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={24} className="text-white" />
            </button>

            <div className="flex-1 mx-4 relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-1/3 p-2 rounded-l-lg bg-blue-700 text-white focus:outline-none transition-all ease-in-out duration-300 shadow-lg"
              />
              <button className="p-2.5 rounded-r-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none transition-all ease-in-out duration-300 shadow-lg hover:scale-105">
                <Search size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-all ease-in-out duration-300">
                <Bell size={20} className="text-white" />
              </button>
              <div className="w-8 h-8 bg-blue-500 rounded-full transition-all ease-in-out duration-300"></div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <RedeemRequestListPart allRedeemRequests={redeemRequestList} />
        </main>
      </div>
    </div>
  );
};

export default RedeemRequestListPage;
