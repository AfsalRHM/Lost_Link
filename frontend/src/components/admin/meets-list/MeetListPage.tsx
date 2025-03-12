import { useEffect, useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import NavBar from "../shared/Navbar";
import MeetListPart from "./MeetListPart";
import fetchAllMeets from "../../../api/admin-api/allMeetsAPI";

const MeetListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const JwtErrors = useAdminJwtErrors();
  const [meetList, setMeetList] = useState([]);

  const getAllMeets = async () => {
    try {
      const response = await fetchAllMeets();

      console.log(response);

      if (response && response.data && response.data.status) {
        setMeetList(response.data.data);
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
      console.error("Error in getAllMeets:", error);
    }
  };

  useEffect(() => {
    getAllMeets();
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
          <MeetListPart allMeets={meetList} />
        </main>
      </div>
    </div>
  );
};

export default MeetListPage;
