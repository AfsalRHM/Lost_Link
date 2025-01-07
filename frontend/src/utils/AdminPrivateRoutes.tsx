import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export function AdminPrivateRoute() {
  const currentAdmin = useSelector((state: RootState) => state.adminDetails);
  return currentAdmin.adminId ? <Navigate to="/admin" /> : <Outlet /> ;
}
