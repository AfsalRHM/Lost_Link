import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface Props {
  adminAccessToken: string;
}

export default async function fetchAllRequests(props: Props): Promise<any> {
  try {
    const result = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/getAllRequestsAdmin`,
      {
        headers: {
          Authorization: `Bearer ${props.adminAccessToken}`,
        },
      }
    );
    return result;
  } catch (error) {
    console.log(error, "error on the allUsersAPI");
    return false;
  }
}
