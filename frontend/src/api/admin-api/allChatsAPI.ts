import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function fetchAllChats(): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .get(`${import.meta.env.VITE_API_ROUTE}/chat/all-chats`)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the allChatsAPI");
    return false;
  }
}
