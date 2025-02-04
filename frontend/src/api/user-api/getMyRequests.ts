import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getMyRequests(
  userRequests: string[] | undefined
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/getMyRequests`,
      { userRequests }
    );

    return response;
  } catch (error) {
    console.error("Error fetching All Requests:", error);
    return false;
  }
}
