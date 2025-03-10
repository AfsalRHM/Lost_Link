import { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
import {
  CalendarRange,
  Filter,
  Download,
  MoreHorizontal,
  Briefcase,
} from "lucide-react";

// Project request data
const projectData = [
  { name: "Jan", completed: 32, inProgress: 18, pending: 14, target: 45 },
  { name: "Feb", completed: 38, inProgress: 21, pending: 12, target: 45 },
  { name: "Mar", completed: 41, inProgress: 23, pending: 17, target: 50 },
  { name: "Apr", completed: 47, inProgress: 19, pending: 13, target: 50 },
  { name: "May", completed: 43, inProgress: 25, pending: 16, target: 55 },
  { name: "Jun", completed: 52, inProgress: 28, pending: 19, target: 55 },
];

const periods = ["Last 6 Months", "This Year", "Last Year", "All Time"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalRequests =
      (payload.find((p: any) => p.dataKey === "completed")?.value || 0) +
      (payload.find((p: any) => p.dataKey === "inProgress")?.value || 0) +
      (payload.find((p: any) => p.dataKey === "pending")?.value || 0);

    return (
      <div className="bg-blue-900 p-3 rounded-md shadow-md border border-blue-800">
        <p className="text-blue-100 font-medium text-sm">{label}</p>
        <p className="text-green-300 font-semibold text-sm">
          Completed:{" "}
          {payload.find((p: any) => p.dataKey === "completed")?.value || 0}
        </p>
        <p className="text-yellow-300 font-semibold text-sm">
          In Progress:{" "}
          {payload.find((p: any) => p.dataKey === "inProgress")?.value || 0}
        </p>
        <p className="text-orange-300 font-semibold text-sm">
          Pending:{" "}
          {payload.find((p: any) => p.dataKey === "pending")?.value || 0}
        </p>
        <div className="mt-1 pt-1 border-t border-blue-800">
          <p className="text-white font-semibold text-sm">
            Total: {totalRequests}
          </p>
          <p className="text-blue-300 text-xs">
            Target:{" "}
            {payload.find((p: any) => p.dataKey === "target")?.value || 0}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const ProjectRequestChart = () => {
  const [activePeriod, setActivePeriod] = useState("Last 6 Months");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate statistics
  const lastMonth = projectData[projectData.length - 1];
  const totalRequests =
    lastMonth.completed + lastMonth.inProgress + lastMonth.pending;
  const completionRate = ((lastMonth.completed / totalRequests) * 100).toFixed(
    1
  );
  const targetAchievement = (
    (lastMonth.completed / lastMonth.target) *
    100
  ).toFixed(1);

  return (
    <div>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-green-300" />
            <h3 className="text-blue-100 font-semibold text-lg">
              Project Requests
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

      {/* Project request metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Total Requests (Jun)</p>
          <p className="text-white font-semibold text-lg">{totalRequests}</p>
          <div className="flex items-center text-green-400 text-xs mt-1">
            <span>
              +
              {(
                ((totalRequests -
                  (projectData[projectData.length - 2].completed +
                    projectData[projectData.length - 2].inProgress +
                    projectData[projectData.length - 2].pending)) /
                  (projectData[projectData.length - 2].completed +
                    projectData[projectData.length - 2].inProgress +
                    projectData[projectData.length - 2].pending)) *
                100
              ).toFixed(1)}
              %
            </span>
            <span className="text-blue-300 ml-1">vs May</span>
          </div>
        </div>
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Completion Rate</p>
          <p className="text-white font-semibold text-lg">{completionRate}%</p>
          <div className="flex items-center text-green-400 text-xs mt-1">
            <span>{lastMonth.completed}</span>
            <span className="text-blue-300 ml-1">completed</span>
          </div>
        </div>
        <div className="p-3 bg-blue-800/30 rounded-md">
          <p className="text-blue-300 text-xs">Target Achievement</p>
          <p className="text-white font-semibold text-lg">
            {targetAchievement}%
          </p>
          <div className="flex items-center text-blue-300 text-xs mt-1">
            <span>{lastMonth.target - lastMonth.completed}</span>
            <span className="text-blue-300 ml-1">to target</span>
          </div>
        </div>
      </div>

      {/* Main chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={projectData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
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
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{
                paddingBottom: "10px",
                fontSize: "12px",
                color: "#94A3B8",
              }}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="#F59E0B"
              name="Pending Requests"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="inProgress"
              stackId="a"
              fill="#FBBF24"
              name="In Progress"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="#34D399"
              name="Completed"
              radius={[4, 4, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              name="Monthly Target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
