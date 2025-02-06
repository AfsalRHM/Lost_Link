import { Route } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Profile from "../pages/user/Profile";
import CreateRequestPage from "../pages/user/CreateRequestPage";
import AllRequestsPage from "../pages/user/AllRequestsPage";
import PaymentSuccessPage from "../pages/user/PaymentSuccessPage";
import MyReqeustDetailsPage from "../pages/user/MyReqeustDetailsPage";
import ReqeustDetailsPage from "../pages/user/RequestDetailsPage";
import RequestRedeemPage from "../pages/user/RequestRedeemPage";

import { IsUserLogin } from "../utils/IsUserLogin";

const UserRoutes = () => {
  return (
    <>
      <Route element={<IsUserLogin />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my_request_details" element={<MyReqeustDetailsPage />} />
        <Route path="/create_request" element={<CreateRequestPage />} />
        <Route path="/requests" element={<AllRequestsPage />} />
        <Route path="/requests/request-details" element={<ReqeustDetailsPage />} />
        <Route path="/requests/redeem-request" element={<RequestRedeemPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Route>
    </>
  );
};

export default UserRoutes;
