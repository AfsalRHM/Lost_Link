import { useEffect, useState } from "react";
import RedeemRequestListPart from "./RedeemRequestListPart";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { showErrorToast } from "../../../utils/toastUtils";
import { Sidebar } from "../shared/Sidebar";
import fetchAllRedeemRequests from "../../../api/admin-api/allRedeemRequestsAPI";
import NavBar from "../shared/Navbar";

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
        <NavBar setSidebarOpen={setSidebarOpen} />

        <main className="p-6">
          <RedeemRequestListPart allRedeemRequests={redeemRequestList} />
        </main>
      </div>
    </div>
  );
};

export default RedeemRequestListPage;
