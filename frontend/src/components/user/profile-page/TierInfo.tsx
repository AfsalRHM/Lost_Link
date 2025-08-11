import { useState } from "react";

import { userDataType } from "../../../interface/IuserModel";

const tiers = [
  { name: "Rookie Scout", minPoints: 0, color: "bg-gray-500 text-gray-100" },
  {
    name: "Bronze Scout",
    minPoints: 1,
    color: "bg-yellow-700 text-yellow-200",
  },
  { name: "Silver Scout", minPoints: 2001, color: "bg-gray-400 text-gray-900" },
  {
    name: "Gold Scout",
    minPoints: 5001,
    color: "bg-yellow-400 text-yellow-900",
  },
  {
    name: "Platinum Scout",
    minPoints: 10001,
    color: "bg-blue-400 text-blue-900",
  },
  {
    name: "Diamond Scout",
    minPoints: 25001,
    color: "bg-cyan-400 text-cyan-900",
  },
  {
    name: "Mythic Scout",
    minPoints: 50001,
    color: "bg-purple-500 text-purple-200",
  },
  {
    name: "Legendary Scout",
    minPoints: 100000,
    color: "bg-red-500 text-red-200",
  },
];

const TierInfo = ({ userData }: { userData: userDataType | undefined }) => {
  const [currentField, setCurrentField] = useState<string>("info");

  function handleTierField(field: string) {
    setCurrentField(field);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Tier Information
      </h2>

      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        {["info", "history"].map((field) => (
          <button
            key={field}
            onClick={() => handleTierField(field)}
            className={`text-sm font-medium capitalize focus:outline-none ${
              currentField === field
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {field}
          </button>
        ))}
      </div>

      {/* User's Current Points */}
      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        <span className="text-gray-600 font-semibold">
          Your Current Points:
        </span>
        <span className="text-gray-400 font-bold underline-offset-2">
          {userData?.points?.toLocaleString() || "Not Available"}
        </span>
      </div>

      {currentField === "info" ? (
        <>
          {/* Tier Information Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Tier Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tiers.map((tier: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className={`px-6 py-3 text-sm ${tier.color} rounded-md`}
                    >
                      {tier.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {tier.minPoints === 0
                        ? "0"
                        : tiers[index + 1]
                        ? `${tier.minPoints} - ${
                            tiers[index + 1].minPoints - 1
                          }`
                        : `${tier.minPoints}+`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    SI No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Request Id
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Completed Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userData?.completedRequests?.length ? (
                  userData.completedRequests.map((entry, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {entry.requestId.slice(0, 6).toUpperCase()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {entry.pointsEarned.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-3 text-sm text-center text-gray-500"
                    >
                      No history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TierInfo;
