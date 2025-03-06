import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface fetchUserChatsType {
  userId: string | undefined;
}

export default async function fetchUserChats(
  props: fetchUserChatsType
): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(`${import.meta.env.VITE_API_ROUTE}/chat/get-user-chats`, props)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the allChatsAPI");
    return false;
  }
}
