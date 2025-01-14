import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeAdminDetails } from "../redux/slice/adminDetailsSlice";
import {
  removeAccessToken,
  removeAdminAccessToken,
} from "../redux/slice/accessTokenSlice";
import { showErrorToast } from "./toastUtils";
import { jwtErrorsType } from "../interface/IjwtErrors";
import { removeUserDetails } from "../redux/slice/userDetailsSlice";

export const useAdminJwtErrors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (props: jwtErrorsType) => {
    if (props.reason === "session expiration") {
      dispatch(removeAdminDetails());
      dispatch(removeAdminAccessToken());
      navigate("/admin/login");
      showErrorToast("Session Expired! Please Login...");
    }
  };
};

export const useUserJwtErrors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (props: jwtErrorsType) => {
    if (props.reason === "session expiration") {
      dispatch(removeUserDetails());
      dispatch(removeAccessToken());
      navigate("/signin");
      showErrorToast("Session Expired! Please Login...");
    }
  };
};
