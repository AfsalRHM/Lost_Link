import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface Props {
  userId: string | undefined;
}

export default async function fetchUserDetails(props: Props): Promise<any> {
  try {
    const response = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/user/get-user-details/${props.userId}`
    );

    return response;
  } catch (error) {
    console.error("Error in fetchUserMessagesAPI:", error);
    return false;
  }
}
