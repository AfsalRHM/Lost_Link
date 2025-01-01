import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/user/LandingPage";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { PrivateRoute } from "./utils/PrivateRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<PrivateRoute />}>
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
