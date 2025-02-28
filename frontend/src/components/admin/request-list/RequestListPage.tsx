import { Sidebar } from "../shared/Sidebar";
import { useEffect, useState } from "react";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import fetchAllRequests from "../../../api/admin-api/allRequestAPI";
import RequestListPart from "./RequestListPart";
import NavBar from "../shared/Navbar";

const RequestListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const JwtErrors = useAdminJwtErrors();
  const [requestList, setRequestList] = useState([]);

  const getAllRequest = async () => {
    try {
      const response = await fetchAllRequests();

      if (response && response.data && response.data.status) {
        setRequestList(response.data.data);
      } else if (response === false) {
        JwtErrors({ reason: "session expiration" });
        try {
          await adminLogout();
        } catch (logoutError) {
          console.error("Error during admin logout:", logoutError);
        }
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error in getAllRequests:", error);
    }
  };

  useEffect(() => {
    getAllRequest();
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
          <RequestListPart
            allRequests={requestList}
            allRequestsFunc={getAllRequest}
          />
        </main>
      </div>
    </div>
  );
};

export default RequestListPage;
