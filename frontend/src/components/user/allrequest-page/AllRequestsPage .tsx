import { useEffect, useState } from "react";
import FilterSideBar from "./FilterSideBar";
import getAllRequests from "../../../api/user-api/getAllRequestsAPI";
import { useDispatch } from "react-redux";
import {
  assignAccessToken,
  removeAccessToken,
} from "../../../redux/slice/accessTokenSlice";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../utils/toastUtils";
import RequestLoading from "./loading/AllRequestLoading";
import RequestPart from "./RequestPart";

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
        console.log(response);
        if (response.status === 401) {
          dispatch(removeUserDetails());
          dispatch(removeAccessToken());
          navigate("/login");
          showErrorToast(response.data.message);
        } else if (response.data.status) {
          const newAccessToken =
            response.headers["authorization"].split(" ")[1];
          dispatch(assignAccessToken(newAccessToken));
          setallRequests(response.data.data);
        } else {
          showErrorToast("Failed to Fetch requests from browser...!");
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

  if (loading)
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
