import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getRequestRedeemDetails(
  requestRedeemId: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/get_redeem_request_details`,
      { requestRedeemId }
    );
    return response;
  } catch (error) {
    console.error("Error fetching Request Details:", error);
    return false;
  }
}
