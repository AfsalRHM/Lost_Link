import { useEffect, useState } from "react";

import { userService } from "../../../services/userService";

import FilterSideBar from "./FilterSideBar";
import RequestLoading from "./loading/AllRequestLoading";
import RequestPart from "./RequestPart";
import FilterSideBarLoading from "./loading/FilterSideBarLoading";

const AllRequests = () => {
  const [allRequests, setallRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    minReward: 0,
    maxReward: 1000,
    location: "",
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await userService.getAllRequests({
          location: filters.location,
          minReward: filters.minReward,
          maxReward: filters.maxReward,
        });

        setallRequests(data.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [filters]);

  if (loading) {
    return (
      <div className="bg-activity min-h-screen flex flex-col lg:flex-row">
        <FilterSideBarLoading />
        <RequestLoading />
      </div>
    );
  }

  return (
    <div className="bg-activity min-h-screen flex flex-col lg:flex-row">
      <FilterSideBar setFilters={setFilters} filters={filters} />
      <RequestPart allRequests={allRequests} />
    </div>
  );
};

export default AllRequests;
