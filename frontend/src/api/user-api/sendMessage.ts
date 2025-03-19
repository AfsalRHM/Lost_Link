import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  content: string;
  chatId: string;
  image: string;
}

export default async function saveMessage(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/send-message`,
      props
    );

    return response;
  } catch (error: any) {
    console.error("Error Creating Request:", error);
    return error.response;
  }
}
