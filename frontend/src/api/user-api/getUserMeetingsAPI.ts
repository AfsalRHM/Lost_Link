import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface getRequestDetailsType {
  userId: string;
}

export default async function fetchUserMeetings(props: getRequestDetailsType): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/fetch-user-meetings`,
      props
    );

    return response;
  } catch (error: any) {
    console.error("Error fetchUserMeetingsAPI", error);
    return error.response;
  }
}
