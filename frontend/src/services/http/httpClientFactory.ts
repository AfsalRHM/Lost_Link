import axios, { AxiosInstance } from "axios";
import { store } from "../../redux/store";
import {
  assignAccessToken,
  assignAdminAccessToken,
} from "../../redux/slice/accessTokenSlice";

const API_ROUTE =
  import.meta.env.VITE_NODE_ENV === "Development"
    ? import.meta.env.VITE_API_ROUTE_DEV
    : import.meta.env.VITE_API_ROUTE;

interface ClientOptions {
  tokenKey: "accessToken" | "adminAccessToken";
  refreshEndpoint: string;
  assignTokenAction: typeof assignAccessToken | typeof assignAdminAccessToken;
}

export function createHttpClient({
  tokenKey,
  refreshEndpoint,
  assignTokenAction,
}: ClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: API_ROUTE,
    withCredentials: true,
  });

  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"]) {
        const state = store.getState();
        const token = state.accessToken[tokenKey];
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${API_ROUTE}${refreshEndpoint}`,
            {},
            { withCredentials: true }
          );
          const newAccessToken = response.data.accessToken;

          store.dispatch(assignTokenAction(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (err) {
          console.log("Token refresh failed");
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
