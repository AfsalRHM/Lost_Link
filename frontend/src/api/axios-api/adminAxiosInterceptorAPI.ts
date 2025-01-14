import axios from "axios";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ROUTE,
  withCredentials: true,
});

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
        const newAccessToken = response.headers["authorization"].split(" ")[1];

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
