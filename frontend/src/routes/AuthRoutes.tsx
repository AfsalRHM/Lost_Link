import { Route } from "react-router-dom";
import SignIn from "../pages/user/SignIn";
import SignUp from "../pages/user/SignUp";
import { PrivateRoute } from "../utils/PrivateRoutes";

const AuthRoutes = () => {
  return (
    <>
      <Route element={<PrivateRoute />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </>
  );
};

export default AuthRoutes;
