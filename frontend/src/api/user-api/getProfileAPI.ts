import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getProfile(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/user/get-profile`
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching User profile:", error);
    return error.response;
  }
}
