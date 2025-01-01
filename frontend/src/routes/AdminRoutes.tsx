import { Route } from "react-router-dom";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import UsersList from "../pages/admin/UsersList";

const AdminRoutes = () => {
  return (
    <>
      {/* <Route element={}> */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<UsersList />} />
      {/* </Route> */}
    </>
  );
};

export default AdminRoutes;
