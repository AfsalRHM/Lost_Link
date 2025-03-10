import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  CalendarRange,
  Filter,
  Download,
  MoreHorizontal,
  Users,
} from "lucide-react";

// User count data
const userData = [
  { name: "Jan", activeUsers: 1840, newUsers: 420 },
  { name: "Feb", activeUsers: 2100, newUsers: 380 },
  { name: "Mar", activeUsers: 2290, newUsers: 310 },
  { name: "Apr", activeUsers: 2400, newUsers: 280 },
  { name: "May", activeUsers: 2550, newUsers: 350 },
  { name: "Jun", activeUsers: 2700, newUsers: 390 },
];

const periods = ["Last 6 Months", "This Year", "Last Year", "All Time"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-900 p-3 rounded-md shadow-md border border-blue-800">
        <p className="text-blue-100 font-medium text-sm">{label}</p>
        <p className="text-indigo-300 font-semibold text-sm">
          Active: {payload[0].value.toLocaleString()} users
        </p>
        <p className="text-green-300 font-semibold text-sm">
          New: {payload[1].value.toLocaleString()} users
        </p>
      </div>
    );
  }
  return null;
};

export const UserCountChart: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState("Last 6 Months");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate statistics
  const currentActiveUsers = userData[userData.length - 1].activeUsers;
  const totalNewUsers = userData.reduce((sum, item) => sum + item.newUsers, 0);
  const avgMonthlyGrowth = (
    ((userData[userData.length - 1].activeUsers / userData[0].activeUsers - 1) *
      100) /
    (userData.length - 1)
  ).toFixed(1);

  return (
    <div>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-300" />
            <h3 className="text-blue-100 font-semibold text-lg">
              User Statistics
            </h3>
          </div>
          <div className="flex items-center px-2 py-1 bg-blue-800/30 rounded-md text-blue-300 text-xs">
            <CalendarRange size={14} className="mr-1" />
            {activePeriod}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-md hover:bg-blue-800/50 text-blue-300 transition-colors"
            >
              <Filter size={16} />
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-1 bg-blue-900 border border-blue-800 rounded-md shadow-lg z-10 p-2 w-40">
                <p className="text-blue-300 text-xs px-2 pb-1 border-b border-blue-800 mb-1">
                  Time Period
                </p>
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setActivePeriod(period);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-2 py-1 text-sm rounded-md text-blue-100 transition-colors ${
                      activePeriod === period
                        ? "bg-blue-700/50"
                        : "hover:bg-blue-800/50"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="p-2 rounded-md hover:bg-blue-800/50 text-blue-300 transition-colors">
            <Download size={16} />
          </button>

          <button className="p-2 rounded-md hover:bg-blue-800/50 text-blue-300 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* User metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Active Users</p>
          <p className="text-white font-semibold text-lg">
            {currentActiveUsers.toLocaleString()}
          </p>
          <div className="flex items-center text-green-400 text-xs mt-1">
            <span>+4.7%</span>
            <span className="text-blue-300 ml-1">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">New Users</p>
          <p className="text-white font-semibold text-lg">
            {totalNewUsers.toLocaleString()}
          </p>
          <div className="flex items-center text-green-400 text-xs mt-1">
            <span>+12.3%</span>
            <span className="text-blue-300 ml-1">vs previous</span>
          </div>
        </div>
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Monthly Growth</p>
          <p className="text-white font-semibold text-lg">
            {avgMonthlyGrowth}%
          </p>
          <div className="flex items-center text-green-400 text-xs mt-1">
            <span>+0.8%</span>
            <span className="text-blue-300 ml-1">vs target</span>
          </div>
        </div>
      </div>

      {/* Main chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={userData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="colorChurnedUsers"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#4B5563"
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              tick={{ fill: "#94A3B8" }}
              axisLine={{ stroke: "#475569", opacity: 0.3 }}
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fill: "#94A3B8" }}
              axisLine={{ stroke: "#475569", opacity: 0.3 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="activeUsers"
              name="Active Users"
              stroke="#818CF8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActiveUsers)"
              activeDot={{ r: 6, strokeWidth: 1, fill: "#818CF8" }}
            />
            <Area
              type="monotone"
              dataKey="newUsers"
              name="New Users"
              stroke="#34D399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNewUsers)"
            />
            <Area
              type="monotone"
              dataKey="churnedUsers"
              name="Churned Users"
              stroke="#F87171"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorChurnedUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
