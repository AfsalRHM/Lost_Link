import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:7000/auth/refreshToken",
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = response.headers["authorization"].split(" ")[1];

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
