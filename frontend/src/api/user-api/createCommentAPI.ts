import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  requestId: string;
  commentText: string;
  userId: string;
}

export default async function createComment(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/create-comment`,
      props
    );

    return response;
  } catch (error) {
    console.error("Error Creating Comment:", error);
    return false;
  }
}
