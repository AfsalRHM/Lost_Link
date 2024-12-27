import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { assignCurrentPage } from "../redux/slice/currentPageSlice";

const PageTracker = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(assignCurrentPage(location.pathname));
  }, [location, dispatch]);

  return null; 
};

export default PageTracker;
