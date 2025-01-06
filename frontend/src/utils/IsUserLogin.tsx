import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export function IsUserLogin() {
  const currentUser = useSelector((state: RootState) => state.userDetails);
  return currentUser.userId ? <Outlet /> : <Navigate to="/signin" />;
}
