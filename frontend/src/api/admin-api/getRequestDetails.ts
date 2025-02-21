import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface Props {
  requestId: string | undefined;
}

export default async function fetchRequestDetails(props: Props): Promise<any> {
  try {
    const response = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/get-request-details/${props.requestId}`
    );

    return response;
  } catch (error) {
    console.error("Error in fetchUserMessagesAPI:", error);
    return false;
  }
}
