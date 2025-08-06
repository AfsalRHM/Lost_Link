import axios, { AxiosInstance } from "axios";

import { store } from "../../redux/store";
import {
  assignAccessToken,
  assignAdminAccessToken,
} from "../../redux/slice/accessTokenSlice";
import { showErrorToast2 } from "../../utils/iziToastUtils";

const API_ROUTE =
  import.meta.env.VITE_NODE_ENV === "Development"
    ? import.meta.env.VITE_API_ROUTE_DEV
    : import.meta.env.VITE_API_ROUTE;

interface ClientOptions {
  tokenKey: "accessToken" | "adminAccessToken";
  refreshEndpoint: string;
  assignTokenAction: typeof assignAccessToken | typeof assignAdminAccessToken;
  cleanUp: () => void;
}

interface RefreshState {
  isRefreshing: boolean;
  refreshTokenPromise: Promise<string> | null;
  failedQueue: any[];
}

export function createHttpClient({
  tokenKey,
  refreshEndpoint,
  assignTokenAction,
  cleanUp,
}: ClientOptions): AxiosInstance {
  const refreshState: RefreshState = {
    isRefreshing: false,
    refreshTokenPromise: null,
    failedQueue: [],
  };

  function processQueue(error: any, token: string | null = null) {
    refreshState.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    refreshState.failedQueue = [];
  }

  const instance = axios.create({
    baseURL: API_ROUTE,
    withCredentials: true,
  });

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

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshState.isRefreshing) {
          refreshState.isRefreshing = true;
          refreshState.refreshTokenPromise = axios
            .post(
              `${API_ROUTE}${refreshEndpoint}`,
              {},
              { withCredentials: true }
            )
            .then((response) => {
              const newAccessToken = response.data.accessToken;
              store.dispatch(assignTokenAction(newAccessToken));
              processQueue(null, newAccessToken);
              return newAccessToken;
            })
            .catch((err) => {
              processQueue(err, null);

              cleanUp();

              showErrorToast2("Session expired. Please log in again.");

              setTimeout(() => {
                if (tokenKey == "accessToken") {
                  window.location.href = "/signin";
                } else {
                  window.location.href = "/admin/login";
                }
              }, 1000);

              throw err;
            })
            .finally(() => {
              refreshState.isRefreshing = false;
              refreshState.refreshTokenPromise = null;
            });
        }

        return new Promise((resolve, reject) => {
          refreshState.failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
