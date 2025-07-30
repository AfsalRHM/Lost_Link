import { createHttpClient } from "./httpClientFactory";
import { assignAdminAccessToken } from "../../redux/slice/accessTokenSlice";

export const adminHttpClient = createHttpClient({
  tokenKey: "adminAccessToken",
  refreshEndpoint: "/admin/refreshToken",
  assignTokenAction: assignAdminAccessToken,
});

