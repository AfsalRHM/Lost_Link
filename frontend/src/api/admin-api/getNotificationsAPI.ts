import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function getAdminNotifications(): Promise<any> {
  try {
    const response = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/notif/get-admin-notifications`
    );
    return response;
  } catch (error) {
    console.error("Error fetching Admin Notifications:", error);
    return false;
  }
}
