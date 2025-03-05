import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function getMyReports({
  userId,
}: {
  userId: string;
}): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/get-my-reports`,
      { userId }
    );

    return response;
  } catch (error) {
    console.error("Error fetching All User Reports:", error);
    return false;
  }
}
