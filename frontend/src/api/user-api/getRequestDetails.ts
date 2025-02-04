import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getRequestDetails(
  requestId: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/getRequestDetails`,
      { requestId }
    );

    return response;
  } catch (error) {
    console.error("Error fetching Request Details:", error);
    return false;
  }
}
