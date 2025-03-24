import axios from "axios";
import { store } from "../../redux/store";
import { assignAdminAccessToken } from "../../redux/slice/accessTokenSlice";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ROUTE,
  withCredentials: true,
});

// Request Interceptor (Add Authorization Header)
adminAxiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const state = store.getState();
      const accessToken = state.accessToken.adminAccessToken;

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Handle the 401 Error)
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_ROUTE}/admin/refreshToken`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.accessToken;

        store.dispatch(assignAdminAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return adminAxiosInstance(originalRequest);
      } catch (error) {
        console.log("refresh Failed");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
