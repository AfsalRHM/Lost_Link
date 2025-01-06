import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export function IsAdminLogin() {
  const currentAdmin = useSelector((state: RootState) => state.adminDetails);
  return currentAdmin.adminId ? <Outlet /> : <Navigate to="/admin/login" /> ;
}
