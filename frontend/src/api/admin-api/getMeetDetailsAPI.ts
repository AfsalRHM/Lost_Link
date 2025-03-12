import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface fetchMeetDataProps {
  meetId: string | undefined;
}

export default async function fetchMeetData(
  props: fetchMeetDataProps
): Promise<any> {
  try {
    const response = await adminAxiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/fetch-admin-meet-data`,
      props
    );

    return response;
  } catch (error) {
    console.error("Error in fetchMeetDataAPI:", error);
    return false;
  }
}
