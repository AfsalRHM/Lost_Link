import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getRequestDetails(
  {requestId, from}:{requestId: string,
  from: string}
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/get-request-details`,
      { requestId, from }
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching Request Details:", error);
    return error.response;
  }
}
