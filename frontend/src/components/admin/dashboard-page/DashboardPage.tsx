import { useState } from "react";
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Sidebar } from "../shared/Sidebar";
import { StatCard } from "./StatCard";
import { RevenueChart } from "./RevenueChart";
import { SalesChart } from "./SalesChart";
import { CategoryDistribution } from "./CategoryDistribution";
import { RecentActivity } from "./RecentActivity";
import NavBar from "../shared/Navbar";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      <div
        className={`lg:block fixed top-0 left-0 w-64 h-full bg-blue-800 shadow-md z-10 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64">
        {" "}
        <NavBar setSidebarOpen={setSidebarOpen} />
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
