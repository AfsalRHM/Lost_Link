import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getMyChat(): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/getUserChat`
    );

    console.log(response);
  } catch (error) {
    console.error("Error fetching My Chat Data:", error);
    return false;
  }
}
