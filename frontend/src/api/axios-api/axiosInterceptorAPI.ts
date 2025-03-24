import axios from "axios";
import { store } from "../../redux/store";
import { assignAccessToken } from "../../redux/slice/accessTokenSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ROUTE,
  withCredentials: true,
});

// Request Interceptor (Add Authorization Header)
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const state = store.getState();
      const accessToken = state.accessToken.accessToken;

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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_ROUTE}/auth/refreshToken`,
          {},
          {
            withCredentials: true,
          }
        );
        // const newAccessToken = response.headers["authorization"].split(" ")[1];
        const state = store.getState();
        const accessToken = state.accessToken.accessToken;
        console.log(response, "response of new access token request response");
        console.log("old access token", accessToken);
        const newAccessToken = response.data.accessToken;
        console.log("new access token", newAccessToken);

        store.dispatch(assignAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (error) {
        console.log("refresh Failed");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
