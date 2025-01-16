const FilterSideBar = ({
  setFilters,
  allRequests,
  filters,
  setFilteredRequests,
}: {
  setFilters: any;
  allRequests: any;
  filters: any;
  setFilteredRequests: any;
}) => {
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev: any) => {
      const updatedFilters = { ...prev, [key]: value };
      const filtered = allRequests.filter((request: any) => {
        const matchesCategory =
          updatedFilters.category === "" ||
          request.product_category === updatedFilters.category;
        const matchesReward =
          request.reward_amount >= updatedFilters.minReward &&
          request.reward_amount <= updatedFilters.maxReward;

        return matchesCategory && matchesReward;
      });

      setFilteredRequests(filtered);
      return updatedFilters;
    });
  };

  return (
    <div className="lg:w-1/5 w-full bg-contact p-4 lg:min-h-screen shadow-md">
      <h2 className="text-xl font-bold mb-4 text-violet-600">Filters</h2>
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-700">Category</label>
        <select
          className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-violet-500"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-700">
          Minimum Reward
        </label>
        <input
          type="number"
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
