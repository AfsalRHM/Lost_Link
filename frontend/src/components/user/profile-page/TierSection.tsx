import { useEffect, useState } from "react";

import { userDataType } from "../../../interface/IuserModel";
import {
  getNextTier,
  getPreviousTier,
  getTierByPoints,
} from "../../../utils/tier";

const tierStyles: {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
    hover: string;
    icon: string;
  };
} = {
  "Rookie Scout": {
    bg: "from-gray-500 to-gray-700",
    text: "text-gray-100",
    border: "border-gray-400",
    hover: "hover:from-gray-600 hover:to-gray-800",
    icon: "text-gray-300",
  },
  "Bronze Scout": {
    bg: "from-yellow-700 to-yellow-900",
    text: "text-yellow-200",
    border: "border-yellow-600",
    hover: "hover:from-yellow-800 hover:to-yellow-950",
    icon: "text-yellow-400",
  },
  "Silver Scout": {
    bg: "from-gray-400 to-gray-600",
    text: "text-gray-900",
    border: "border-gray-300",
    hover: "hover:from-gray-500 hover:to-gray-700",
    icon: "text-gray-200",
  },
  "Gold Scout": {
    bg: "from-yellow-400 to-yellow-600",
    text: "text-yellow-900",
    border: "border-yellow-300",
    hover: "hover:from-yellow-500 hover:to-yellow-700",
    icon: "text-yellow-200",
  },
  "Platinum Scout": {
    bg: "from-blue-400 to-blue-600",
    text: "text-blue-900",
    border: "border-blue-300",
    hover: "hover:from-blue-500 hover:to-blue-700",
    icon: "text-blue-200",
  },
  "Diamond Scout": {
    bg: "from-cyan-400 to-cyan-600",
    text: "text-cyan-900",
    border: "border-cyan-300",
    hover: "hover:from-cyan-500 hover:to-cyan-700",
    icon: "text-cyan-200",
  },
  "Mythic Scout": {
    bg: "from-purple-500 to-purple-700",
    text: "text-purple-200",
    border: "border-purple-400",
    hover: "hover:from-purple-600 hover:to-purple-800",
    icon: "text-purple-300",
  },
  "Legendary Scout": {
    bg: "from-red-500 to-red-700",
    text: "text-red-200",
    border: "border-red-400",
    hover: "hover:from-red-600 hover:to-red-800",
    icon: "text-red-300",
  },
};

const TierSection = ({ userData }: { userData?: userDataType }) => {
  const [currentTier, setCurrentTier] = useState<string>("");
  const [nextTier, setNextTier] = useState<string>("");
  const [previousTier, setPreviousTier] = useState<string>("");

  useEffect(() => {
    setCurrentTier(getTierByPoints(userData?.points!));
    setPreviousTier(getPreviousTier(userData?.points!));
    setNextTier(getNextTier(userData?.points!));
  }, [userData?.points]);

  return (
    <div className="mt-6 text-center">
      <div className="flex justify-around text-xs md:text-sm text-gray-500 mb-2">
        <span className="hidden md:block">Previous Tier</span>
        <span>Current Tier</span>
        <span className="hidden md:block">Next Tier</span>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`hidden md:block flex-1 text-center py-3 rounded-lg text-sm shadow-md transition-all duration-300 bg-gradient-to-r ${
            tierStyles[previousTier]?.bg || "from-gray-300 to-gray-400"
          } ${tierStyles[previousTier]?.text || "text-gray-800"}`}
        >
          {previousTier}
        </div>

        <div
          className={`flex-1 text-center py-4 text-lg font-semibold rounded-lg shadow-xl transition-all duration-300 bg-gradient-to-r ${
            tierStyles[currentTier]?.bg || "from-gray-300 to-gray-400"
          } ${
            tierStyles[currentTier]?.text || "text-gray-800"
          } border-2 border-white`}
        >
          {currentTier}
        </div>

        <div
          className={`hidden md:block flex-1 text-center py-3 rounded-lg text-sm shadow-md transition-all duration-300 bg-gradient-to-r ${
            tierStyles[nextTier]?.bg || "from-gray-300 to-gray-400"
          } ${tierStyles[nextTier]?.text || "text-gray-800"}`}
        >
          {nextTier}
        </div>
      </div>
    </div>
  );
};

export default TierSection;
