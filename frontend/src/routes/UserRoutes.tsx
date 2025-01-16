import { Route } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Profile from "../pages/user/Profile";
import CreateRequestPage from "../pages/user/CreateRequestPage";
import { IsUserLogin } from "../utils/IsUserLogin";
import AllRequestsPage from "../pages/user/AllRequestsPage";
import PaymentSuccessPage from "../pages/user/PaymentSuccessPage";

const UserRoutes = () => {
  return (
    <>
      <Route element={<IsUserLogin />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create_request" element={<CreateRequestPage />} />
        <Route path="/requests" element={<AllRequestsPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Route>
    </>
  );
};

export default UserRoutes;
