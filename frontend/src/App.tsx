import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/user/LandingPage";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
import { PrivateRoute } from "./utils/PrivateRoutes";

function App() {
  return (
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        {AuthRoutes()}
        {UserRoutes()}
      </Routes>
  );
}

export default App;
