import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function userLogout(): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/auth/logout`
    );

    return response;
  } catch (error: any) {
    console.error("Error while user logs out:", error);
    return error.response;
  }
}
