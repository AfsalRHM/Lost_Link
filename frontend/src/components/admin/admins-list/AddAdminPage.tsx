import { useEffect, useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import fetchAllAdmins from "../../../api/admin-api/allAdminsAPI";
import { showErrorToast } from "../../../utils/toastUtils";
import AddAdminForm from "./AddAdminForm";
import NavBar from "../shared/Navbar";

const UserListPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [adminList, setAdminList] = useState([]);

  const getAllAdmins = async () => {
    const response = await fetchAllAdmins();
    if (response.data.status) {
      setAdminList(response.data.data);
    } else {
      showErrorToast("Didn't get the Admin List");
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
          <AddAdminForm />
        </main>
      </div>
    </div>
  );
};

export default UserListPage;
