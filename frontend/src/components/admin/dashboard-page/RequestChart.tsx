import { useState } from "react";

import {
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
import processRequestData from "./helper/processRequestData";

const periods = [
  "Today",
  "This Month",
  "Last Month",
  "Last 6 Months",
  "This Year",
  "Last Year",
  "All Time",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-900 p-3 rounded-md shadow-md border border-blue-800">
        <p className="text-blue-100 font-medium text-sm">{label}</p>
        <p className="text-yellow-300 font-semibold text-sm">
          New: {payload.find((p: any) => p.dataKey === "new")?.value || 0}
        </p>
      </div>
    );
  }
  return null;
};

interface ProjectRequestChartProps {
  requestData: any[];
}

export const ProjectRequestChart: React.FC<ProjectRequestChartProps> = ({
  requestData,
}) => {
  const [activePeriod, setActivePeriod] = useState("Last 6 Months");
  const [showFilters, setShowFilters] = useState(false);

  // Process data dynamically based on the selected period
  const chartData = processRequestData(requestData, activePeriod);

  return (
    <div>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-green-300" />
          <h3 className="text-blue-100 font-semibold text-lg">Request Statistics</h3>
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

      {/* Main chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#4B5563"
              opacity={0.1}
            />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="new" fill="#f6e05e" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
