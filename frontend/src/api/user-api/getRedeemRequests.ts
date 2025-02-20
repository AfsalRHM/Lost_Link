import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getRedeemRequests(
  userId: string | undefined
): Promise<any> {
  try {
    console.log(userId);
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/getUserRedeemRequests`,
      { userId }
    );
    return response;
  } catch (error) {
    console.error("Error fetching All Redeem Requests:", error);
    return false;
  }
}
