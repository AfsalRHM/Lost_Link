import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export function UserPrivateRoute() {
  const currentUser = useSelector((state: RootState) => state.userDetails);
  return currentUser.userId ? <Navigate to="/home" /> : <Outlet />;
}
