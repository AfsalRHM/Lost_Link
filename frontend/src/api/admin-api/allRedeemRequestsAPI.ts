import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function fetchAllRedeemRequests(): Promise<any> {
  try {
    const result = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/get-all-redeem-requests`
    );
    return result;
  } catch (error: any) {
    return error.response;
  }
}
