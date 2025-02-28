import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function changeAdminNotificationSeen(): Promise<any> {
  try {
    const result = await axiosInstance
      .patch(
        `${import.meta.env.VITE_API_ROUTE}/notif/change-admin-notification-seen`
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
