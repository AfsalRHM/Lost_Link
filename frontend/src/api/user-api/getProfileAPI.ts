import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getProfile(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/user/getProfile`
    );

    return response;
  } catch (error) {
    console.error("Error fetching User profile:", error);
    return { status: false, reason: "Currenly Unknown Error" };
  }
}
