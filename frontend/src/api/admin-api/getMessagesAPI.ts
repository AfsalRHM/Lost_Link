import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface Props {
  chatId: string | undefined;
}

export default async function fetchUserMessages(props: Props): Promise<any> {
  try {
    const response = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/chat/get-user-messages/${props.chatId}`
    );

    return response;
  } catch (error) {
    console.error("Error in fetchUserMessagesAPI:", error);
    return false;
  }
}
