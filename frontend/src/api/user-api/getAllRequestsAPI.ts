import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  accessToken: string;
}

export default async function getAllRequests(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/getAllRequests`,
      {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching All Requests:", error);
    return false;
  }
}
