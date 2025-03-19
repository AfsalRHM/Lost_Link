import { useEffect, useState } from "react";
import FilterSideBar from "./FilterSideBar";
import getAllRequests from "../../../api/user-api/getAllRequestsAPI";
import RequestLoading from "./loading/AllRequestLoading";
import RequestPart from "./RequestPart";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allRequests, setallRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "",
    minReward: 0,
    maxReward: 1000,
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getAllRequests();

        if (response.status == 200) {
          setallRequests(response.data.data);
        } else {
          console.log(response, "this is the error response on getAllRequests");
          UserErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(allRequests);
  }, [allRequests]);

  if (loading) {
    return (
      <div className="bg-activity min-h-screen flex flex-col lg:flex-row">
        <FilterSideBar
          allRequests={allRequests}
          setFilters={setFilters}
          filters={filters}
          setFilteredRequests={setFilteredRequests}
        />
        <RequestLoading />
      </div>
    );
  }

  return (
    <div className="bg-activity min-h-screen flex flex-col lg:flex-row">
      <FilterSideBar
        allRequests={allRequests}
        setFilters={setFilters}
        filters={filters}
        setFilteredRequests={setFilteredRequests}
      />
      <RequestPart filteredRequests={filteredRequests} />
    </div>
  );
};

export default AllRequests;
