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
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Tier Information
      </h2>

      {/* User's Current Points */}
      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        <span className="text-gray-600 font-semibold">
          Your Current Points:
        </span>
        <span className="text-gray-400 font-bold underline-offset-2">
          {userData?.points?.toLocaleString() || "Not Available"}
        </span>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-3 pl-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Tier Names
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tiers.map((tier: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className={`px-6 py-3 text-sm ${tier.color} rounded-md`}>
                    {tier.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {tier.minPoints === 0
                      ? "0"
                      : tiers[index + 1]
                      ? `${tier.minPoints} - ${tiers[index + 1].minPoints - 1}`
                      : `${tier.minPoints}+`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TierInfo;
