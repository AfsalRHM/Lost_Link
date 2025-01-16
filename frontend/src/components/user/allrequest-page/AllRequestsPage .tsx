import { useEffect, useState } from "react";
import FilterSideBar from "./FilterSideBar";
import ReqeustPart from "./ReqeustPart";
import getAllRequests from "../../../api/user-api/getAllRequestsAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  assignAccessToken,
  removeAccessToken,
} from "../../../redux/slice/accessTokenSlice";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../utils/toastUtils";

const AllRequests = () => {
  const { accessToken } = useSelector((state: RootState) => state.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allRequests, setallRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "", // This initializes the category filter as an empty string
    minReward: 0,
    maxReward: 1000,
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getAllRequests({ accessToken });
        if (response === false) {
          dispatch(removeUserDetails());
          dispatch(removeAccessToken());
          navigate("/login");
          showErrorToast("Session Expired! Please Login...");
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
        <p>Loading...</p>
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
      <ReqeustPart filteredRequests={filteredRequests} />
    </div>
  );
};

export default AllRequests;
