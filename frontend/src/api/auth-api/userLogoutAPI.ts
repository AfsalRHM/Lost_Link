import { logoutProps } from "../../interface/IapiProps";
import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function userLogout(props: logoutProps): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error while user logs out:", error);
    return { status: false };
  }
}
