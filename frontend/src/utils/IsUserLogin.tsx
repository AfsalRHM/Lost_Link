import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export function IsUserLogin() {
  const currentUser = useSelector((state: RootState) => state.userDetails);
  console.log(currentUser.userId, 'This is user');
  return currentUser.userId ? <Outlet /> : <Navigate to="/signin" /> ;
}
