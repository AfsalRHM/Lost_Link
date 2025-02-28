import { useEffect, useState } from "react";
import AdminListPart from "./AdminListPart";
import { Sidebar } from "../shared/Sidebar";
import fetchAllAdmins from "../../../api/admin-api/allAdminsAPI";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import NavBar from "../shared/Navbar";

const UserListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const JwtErrors = useAdminJwtErrors();
  const [adminList, setAdminList] = useState([]);

  const getAllAdmins = async () => {
    try {
      const response = await fetchAllAdmins();

      if (response && response.data && response.data.status) {
        setAdminList(response.data.data);
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
      console.error("Error in getAllAdmins:", error);
    }
  };

  useEffect(() => {
    getAllAdmins();
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
          <AdminListPart allAdmins={adminList} allAdminsFunc={getAllAdmins} />
        </main>
      </div>
    </div>
  );
};

export default UserListPage;
