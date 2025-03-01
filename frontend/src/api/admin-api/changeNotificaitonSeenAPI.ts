import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface chageNotificaitonSeenType {
    notificationId: string;
}

export default async function chageNotificaitonSeen(
  props: chageNotificaitonSeenType
): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .patch(
        `${
          import.meta.env.VITE_API_ROUTE
        }/notif/change-admin-one-notification-seen`,
        props
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the chageNotificaitonSeen");
    return false;
  }
}
