import Geoapify from "../shared/Geoapify";

const SearchLocation = () => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <Geoapify forThe="onProfile" />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
        Search
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border-b">Location</th>
            <th className="p-3 border-b">Users Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b">Example Location</td>
            <td className="p-3 border-b">25</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default SearchLocation;
