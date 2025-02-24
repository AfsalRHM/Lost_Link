import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface Props {
  content: string;
  chatId: string;
  image: string;
}

export default async function saveAdminMessage(props: Props): Promise<any> {
  try {
    const response = await adminAxiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/chat/send-admin-message`,
      props
    );

    return response;
  } catch (error) {
    console.error("Error Sending Admin Message:", error);
    return false;
  }
}
