import axiosInstance from "../axios-api/axiosInterceptorAPI";

type getNotificationsType = {
  userId: string | undefined;
};

export default async function getNotifications(
  props: getNotificationsType
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/notif/get-notifications`,
      props
    );
    return response;
  } catch (error) {
    console.error("Error fetching User Notifications:", error);
    return false;
  }
}
