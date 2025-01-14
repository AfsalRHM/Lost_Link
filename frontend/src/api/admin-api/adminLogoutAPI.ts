import { logoutProps } from "../../interface/IapiProps";
import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function adminLogout(props: logoutProps): Promise<any> {
  try {
    const response = await adminAxiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/admin/logout`,
      {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error while admin logs out:", error);
    return { status: false };
  }
}
