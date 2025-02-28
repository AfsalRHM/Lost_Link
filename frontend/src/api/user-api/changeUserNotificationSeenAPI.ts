import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface propsType {
    userId: string;
}

export default async function changeUserNotificationSeen(Props: propsType): Promise<any> {
  try {
    const result = await axiosInstance
      .patch(
        `${import.meta.env.VITE_API_ROUTE}/notif/change-user-notification-seen`,
        Props
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the changeUserNotificationSeenAPI");
    return false;
  }
}
