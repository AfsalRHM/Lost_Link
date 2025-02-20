import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function fetchAllRequests(): Promise<any> {
  try {
    const result = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/getAllRequestsAdmin`
    );
    return result;
  } catch (error) {
    console.log(error, "error on the allUsersAPI");
    return false;
  }
}
