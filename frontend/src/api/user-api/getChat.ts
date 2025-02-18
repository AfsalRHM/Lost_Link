import axiosInstance from "../axios-api/axiosInterceptorAPI";

type getMyChatPropsType = {
  requestId: string | undefined;
};

export default async function getMyChat(
  props: getMyChatPropsType
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/getUserChat`,
      props
    );
    return response;
  } catch (error) {
    console.error("Error fetching My Chat Data:", error);
    return false;
  }
}
