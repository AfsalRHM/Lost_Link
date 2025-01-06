import { Route } from "react-router-dom";
import SignIn from "../pages/user/SignIn";
import SignUp from "../pages/user/SignUp";
import ForgotPassword from "../pages/user/ForgotPassword";
import { UserPrivateRoute } from "../utils/UserPrivateRoutes";

const AuthRoutes = () => {
  return (
    <>
      <Route element={<UserPrivateRoute />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ForgotPassword />} />
      </Route>
    </>
  );
};

export default AuthRoutes;
