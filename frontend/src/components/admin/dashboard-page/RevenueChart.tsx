import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { AnalyticsData } from "../../../interface/IadminDashboard";

const analyticsData: AnalyticsData[] = [
  { name: "Jan", sales: 4000, revenue: 2400, customers: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398, customers: 2210 },
  { name: "Mar", sales: 2000, revenue: 9800, customers: 2290 },
  { name: "Apr", sales: 2780, revenue: 3908, customers: 2000 },
  { name: "May", sales: 1890, revenue: 4800, customers: 2181 },
  { name: "Jun", sales: 2390, revenue: 3800, customers: 2500 },
];

export const RevenueChart: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold mb-6">Revenue Analytics</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            fill="#93C5FD"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
