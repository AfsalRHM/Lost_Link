import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getAllRequests(): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/getAllRequests`
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
}
