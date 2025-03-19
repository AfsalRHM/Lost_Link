import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  requestId: string | null;
  count: number;
}

export default async function getRequestComments(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/get-request-comments`,
      props
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
}
