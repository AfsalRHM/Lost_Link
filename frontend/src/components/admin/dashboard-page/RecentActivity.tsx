import React from "react";
import { Users, Box, ShoppingCart } from "lucide-react";

export const RecentActivity: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
    <div className="space-y-4">
      {[
        {
          text: "New user registration",
          time: "2 minutes ago",
          icon: <Users size={16} className="text-blue-500" />,
        },
        {
          text: "Product update",
          time: "1 hour ago",
          icon: <Box size={16} className="text-green-500" />,
        },
        {
          text: "New sale",
          time: "3 hours ago",
          icon: <ShoppingCart size={16} className="text-purple-500" />,
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 border-b pb-4 last:border-0"
        >
          <div className="p-2 bg-gray-50 rounded-lg">{item.icon}</div>
          <div className="flex-1">
            <p className="font-medium">{item.text}</p>
            <span className="text-sm text-gray-500">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
