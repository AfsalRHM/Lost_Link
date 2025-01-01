import { useState } from "react";
import {
  Users,
  Bell,
  Menu,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Search,
} from "lucide-react"; // Add Search icon import
import { Sidebar } from "../shared/Sidebar";
import { StatCard } from "./StatCard";
import { RevenueChart } from "./RevenueChart";
import { SalesChart } from "./SalesChart";
import { CategoryDistribution } from "./CategoryDistribution";
import { RecentActivity } from "./RecentActivity";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      {/* Sidebar */}
      <div
        className={`lg:block fixed top-0 left-0 w-64 h-full bg-blue-800 shadow-md z-10 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64">
        {" "}
        {/* Adjust main content to account for sidebar */}
        <header className="sticky top-0 z-20 bg-blue-800 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={24} className="text-white" />
            </button>

            {/* Search Bar */}
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
              {/* Notification Icon */}
              <button className="p-2 hover:bg-blue-700 rounded-lg transition-all ease-in-out duration-300">
                <Bell size={20} className="text-white" />
              </button>

              {/* Profile Icon */}
              <div className="w-8 h-8 bg-blue-500 rounded-full transition-all ease-in-out duration-300"></div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Revenue"
              value="$128,430"
              icon={<DollarSign size={24} className="text-blue-400" />}
              trend="+12.5%"
            />
            <StatCard
              title="Total Requests"
              value="8,549"
              icon={<ShoppingCart size={24} className="text-green-400" />}
              trend="+8.2%"
            />
            <StatCard
              title="Active Users"
              value="2,544"
              icon={<Users size={24} className="text-purple-400" />}
              trend="+15.3%"
            />
            <StatCard
              title="Growth Rate"
              value="23.5%"
              icon={<TrendingUp size={24} className="text-orange-400" />}
              trend="+4.1%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart />
            <SalesChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryDistribution />
            </div>
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
