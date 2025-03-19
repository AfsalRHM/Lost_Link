import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  chatId: string | undefined;
}

export default async function getAllMessagesOfChat(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/chat/get-messages/${props.chatId}`
    );

    return response;
  } catch (error: any) {
    console.error("Error Creating Request:", error);
    return error.response;
  }
}
