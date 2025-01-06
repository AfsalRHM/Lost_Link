import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/user/LandingPage";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { UserPrivateRoute } from "./utils/UserPrivateRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<UserPrivateRoute />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        {AuthRoutes()}
        {UserRoutes()}
        {AdminRoutes()}
      </Routes>
    </>
  );
}

export default App;
