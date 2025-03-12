import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function fetchAllMeets(): Promise<any> {
  try {
    const result = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/chat/fetch-all-meets`
    );
    return result;
  } catch (error) {
    console.log(error, "error on the allUsersAPI");
    return false;
  }
}
