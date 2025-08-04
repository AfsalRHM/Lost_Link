import { createHttpClient } from "./httpClientFactory";
import { store } from "../../redux/store";

import {
  assignAdminAccessToken,
  removeAdminAccessToken,
} from "../../redux/slice/accessTokenSlice";
import { removeAdminDetails } from "../../redux/slice/adminDetailsSlice";

export const adminHttpClient = createHttpClient({
  tokenKey: "adminAccessToken",
  refreshEndpoint: "/admin/refreshToken",
  assignTokenAction: assignAdminAccessToken,
  cleanUp: () => {
    store.dispatch(removeAdminAccessToken());
    store.dispatch(removeAdminDetails());
  },
});
