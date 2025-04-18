import { Route } from "react-router-dom";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import UsersList from "../pages/admin/UsersList";
import AdminList from "../pages/admin/AdminsList";
import { IsAdminLogin } from "../utils/IsAdminLogin";
import { AdminPrivateRoute } from "../utils/AdminPrivateRoutes";
import AddAdmin from "../pages/admin/AddAdmin";
import RequestList from "../pages/admin/RequestList";
import ChatList from "../pages/admin/ChatList";
import ChatDetails from "../pages/admin/ChatDetails";
import RedeemRequestList from "../pages/admin/RedeemRequestList";
import UserDetails from "../pages/admin/UserDetails";
import RequestDetails from "../pages/admin/RequestDetails";
import RedeemRequestDetails from "../pages/admin/RedeemRequestDetails";
import MeetList from "../pages/admin/MeetList";
import MeetDetails from "../pages/admin/MeetDetails";
import NotFound from "../pages/admin/NotFound";

const AdminRoutes = () => {
  return (
    <>
      <Route path="*" element={<NotFound />} />

      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin/login" element={<Login />} />
      </Route>

      <Route element={<IsAdminLogin />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/users/user-details/:id" element={<UserDetails />} />
        <Route path="/admin/admins" element={<AdminList />} />
        <Route path="/admin/addadmin" element={<AddAdmin />} />
        <Route path="/admin/requests" element={<RequestList />} />
        <Route path="/admin/requests/request-details/:id" element={<RequestDetails />} />
        <Route path="/admin/chats" element={<ChatList />} />
        <Route path="/admin/redeem-requests" element={<RedeemRequestList />} />
        <Route path="/admin/redeem-requests/details/:id" element={<RedeemRequestDetails />} />
        <Route path="/admin/chats/:userId" element={<ChatDetails />} />
        <Route path="/admin/meetings" element={<MeetList />} />
        <Route path="/admin/meetings/:meetId" element={<MeetDetails />} />
      </Route>

      <Route path="/admin/404" element={<NotFound />} />
    </>
  );
};

export default AdminRoutes;
