import { Route } from "react-router-dom";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import UsersList from "../pages/admin/UsersList";
import AdminList from "../pages/admin/AdminsList";
import UserDetailsPage from "../components/admin/user-details/UserDetailsPage";
import { IsAdminLogin } from "../utils/IsAdminLogin";
import { AdminPrivateRoute } from "../utils/AdminPrivateRoutes";
import AddAdmin from "../pages/admin/AddAdmin";

const AdminRoutes = () => {
  return (
    <>
      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin/login" element={<Login />} />
      </Route>
      <Route element={<IsAdminLogin />}>
        <Route path="/admin" element={<Dashboard />} /> 
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/userdetails" element={<UserDetailsPage />} />
        <Route path="/admin/admins" element={<AdminList />} />
        <Route path="/admin/addadmin" element={<AddAdmin />} />
      </Route>
    </>
  );
};

export default AdminRoutes;
