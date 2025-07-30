import { createHttpClient } from "./httpClientFactory";
import { assignAccessToken } from "../../redux/slice/accessTokenSlice";

export const userHttpClient = createHttpClient({
  tokenKey: "accessToken",
  refreshEndpoint: "/auth/refreshToken",
  assignTokenAction: assignAccessToken,
});