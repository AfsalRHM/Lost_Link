import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  CalendarRange,
  Filter,
  Download,
  MoreHorizontal,
  DollarSign,
} from "lucide-react";

import { AnalyticsData } from "../../../interface/IadminDashboard";

const analyticsData: AnalyticsData[] = [
  { name: "Jan", sales: 4000, revenue: 2400, customers: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398, customers: 2210 },
  { name: "Mar", sales: 2000, revenue: 9800, customers: 2290 },
  { name: "Apr", sales: 2780, revenue: 3908, customers: 2000 },
  { name: "May", sales: 1890, revenue: 4800, customers: 2181 },
  { name: "Jun", sales: 2390, revenue: 3800, customers: 2500 },
];

const periods = ["Last 6 Months", "This Year", "Last Year", "All Time"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-900 p-3 rounded-md shadow-md border border-blue-800">
        <p className="text-blue-100 font-medium text-sm">{label}</p>
        <p className="text-indigo-300 font-semibold text-sm">
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-orange-300 font-semibold text-sm">
          Sales: {payload[1].value.toLocaleString()} units
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState("Last 6 Months");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate statistics
  const totalRevenue = analyticsData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const averageMonthly = Math.round(totalRevenue / analyticsData.length);
  const highestMonth = Math.max(...analyticsData.map((item) => item.revenue));
  const highestMonthName = analyticsData.find(
    (item) => item.revenue === highestMonth
  )?.name;

  return (
    <div>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-blue-300" />
            <h3 className="text-blue-100 font-semibold text-lg">
              Revenue Analytics
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

      {/* Revenue metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Total Revenue</p>
          <p className="text-white font-semibold text-lg">
            ${totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center text-green-400 text-xs mt-1">
            <span>+12.5%</span>
            <span className="text-blue-300 ml-1">from last period</span>
          </div>
        </div>
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Average Monthly</p>
          <p className="text-white font-semibold text-lg">
            ${averageMonthly.toLocaleString()}
          </p>
          <div className="flex items-center text-yellow-400 text-xs mt-1">
            <span>+2.1%</span>
            <span className="text-blue-300 ml-1">from last period</span>
          </div>
        </div>
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Highest Month</p>
          <p className="text-white font-semibold text-lg">
            ${highestMonth.toLocaleString()}
          </p>
          <p className="text-blue-300 text-xs mt-1">{highestMonthName}</p>
        </div>
      </div>

      {/* Main chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
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
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#94A3B8" }} />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#4F46E5"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="sales"
              name="Sales"
              fill="#F97316"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
