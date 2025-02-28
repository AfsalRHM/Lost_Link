import { useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import RequestDetailsPart from "./RequestDetailsPart";
import NavBar from "../shared/Navbar";

const RequestDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <RequestDetailsPart />
        </main>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
