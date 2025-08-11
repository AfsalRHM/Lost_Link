import { useEffect, useState } from "react";

import { adminService } from "../../../services/adminService";

import AdminListPart from "./AdminListPart";
import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

const UserListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminList, setAdminList] = useState<Admin[]>([]);

  const getAllAdmins = async () => {
    try {
      const response = await adminService.getAdmins();

      if (response && response.data && response.data.status) {
        setAdminList(response.data.data);
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
          <AdminListPart allAdmins={adminList} setAdminList={setAdminList} />
        </main>
      </div>
    </div>
  );
};

export default UserListPage;
