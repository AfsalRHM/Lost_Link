import React from "react";

import { StatCardProps } from "../../../interface/IadminDashboard";

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-md transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white backdrop-blur-sm rounded-xl">{icon}</div>
      </div>
      <h3 className="text-blue-200 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-100 to-indigo-100 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
};
