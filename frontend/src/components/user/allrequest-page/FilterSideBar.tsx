import Geoapify from "../shared/Geoapify";

const FilterSideBar = ({
  setFilters,
  filters,
}: {
  setFilters: any;
  filters: any;
}) => {
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev: any) => {
      return { ...prev, [key]: value };
    });
  };

  const handleLocationChange = (value: string) => {
    handleFilterChange("location", value);
  };

  return (
    <div className="lg:w-1/5 w-full bg-contact p-4 lg:min-h-screen shadow-md">
      <h2 className="text-xl font-bold mb-4 text-violet-600">Filters</h2>
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-700">Location</label>
        <Geoapify forThe="filters" stateFunc={handleLocationChange} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-700">
          Minimum Reward
        </label>
        <input
          type="number"
          placeholder="Enter a minimum reward amount"
          className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-violet-500"
          value={filters.minReward}
          onChange={(e) =>
            handleFilterChange("minReward", Number(e.target.value))
          }
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-700">
          Maximum Reward
        </label>
        <input
          type="number"
          placeholder="Enter a maximum reward amount"
          className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-violet-500"
          value={filters.maxReward}
          onChange={(e) =>
            handleFilterChange("maxReward", Number(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default FilterSideBar;
