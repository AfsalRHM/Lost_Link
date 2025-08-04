import { createHttpClient } from "./httpClientFactory";
import { store } from "../../redux/store";

import {
  assignAccessToken,
  removeAccessToken,
} from "../../redux/slice/accessTokenSlice";
import { removeUserDetails } from "../../redux/slice/userDetailsSlice";

export const userHttpClient = createHttpClient({
  tokenKey: "accessToken",
  refreshEndpoint: "/auth/refreshToken",
  assignTokenAction: assignAccessToken,
  cleanUp: () => {
    store.dispatch(removeAccessToken());
    store.dispatch(removeUserDetails());
  },
});
