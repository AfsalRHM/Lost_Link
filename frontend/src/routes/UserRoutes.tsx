import { Route } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Profile from "../pages/user/Profile";
import { IsUserLogin } from "../utils/IsUserLogin";

const UserRoutes = () => {
  return (
    <>
      <Route element={<IsUserLogin />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </>
  );
};

export default UserRoutes;
