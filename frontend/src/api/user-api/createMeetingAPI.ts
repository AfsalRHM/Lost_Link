import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface createMeetingProps {
  date: string;
  time: string;
  userId: string;
  requestId: string;
  userName: string;
}

export default async function createMeeting(
  props: createMeetingProps
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/create-meeting`,
      props
    );

    return response;
  } catch (error) {
    console.error("Error Creating Meeting:", error);
    return false;
  }
}
