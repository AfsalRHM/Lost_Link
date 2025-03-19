import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 text-white">
      <div
        className={`lg:block fixed top-0 left-0 w-64 h-full bg-blue-900/70 backdrop-blur-md shadow-lg z-10 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <NavBar setSidebarOpen={setSidebarOpen} />

        <main className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-lg mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <AlertCircle size={120} className="text-blue-200 opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">404</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-100">
              Page Not Found
            </h1>

            <p className="text-blue-200 text-lg mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/admin")}
                className="px-6 py-3 bg-blue-800/70 hover:bg-blue-800 text-blue-100 font-medium rounded-md border border-blue-600/30 flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={20} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;
