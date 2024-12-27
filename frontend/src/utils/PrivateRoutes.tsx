import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export function PrivateRoute() {
  const currentUser = useSelector((state: RootState) => state.userDetails);
  console.log(currentUser.userId, 'This is printing');
  return currentUser.userId ? <Navigate to="/home" /> : <Outlet /> ;
}
