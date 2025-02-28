import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  requestId: string | null;
  reportReason: string;
  userId: string;
}

export default async function reportRequest(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/report-request`,
      props
    );

    return response;
  } catch (error) {
    console.error("Error While Reporting a Request:", error);
    return false;
  }
}
