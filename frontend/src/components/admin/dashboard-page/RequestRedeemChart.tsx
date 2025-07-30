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
  SquareCheckBig,
} from "lucide-react";
import processRedeemRequestData from "./helper/processRedeemRequestData"; // You process data based on the selected period

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
        <p className="text-green-300 font-semibold text-sm">
          new: {payload[0].value || 0}
        </p>
      </div>
    );
  }
  return null;
};

interface RedeemRequestChartProps {
  redeemRequestData: any[];
}

export const RedeemRequestChart: React.FC<RedeemRequestChartProps> = ({
  redeemRequestData,
}) => {
  const [activePeriod, setActivePeriod] = useState("Last 6 Months");
  const [showFilters, setShowFilters] = useState(false);

  const chartData = processRedeemRequestData(redeemRequestData, activePeriod);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <SquareCheckBig size={18} className="text-yellow-300" />
          <h3 className="text-blue-100 font-semibold text-lg">
            Redeem Request Statistics
          </h3>
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

      {/* Chart */}
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
            <Bar dataKey="new" fill="#2cb87b" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
