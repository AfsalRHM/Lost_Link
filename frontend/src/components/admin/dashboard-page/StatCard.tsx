import React from "react";
import { StatCardProps } from "../../../interface/IadminDashboard";

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        {icon}
      </div>
      <span
        className={`text-sm font-semibold ${
          trend.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {trend}
      </span>
    </div>
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
      {value}
    </p>
  </div>
);
