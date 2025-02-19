import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface propsType {
  chatId: string | undefined;
}

export default async function fetchChatDetails(Props: propsType): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(
        `${import.meta.env.VITE_API_ROUTE}/chat/get-user-chat-details`,
        Props
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the fetchChatDetailsAPI");
    return false;
  }
}
