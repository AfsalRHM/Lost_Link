import { logoutProps } from "../../interface/IapiProps";
import axiosInstance from "../axios-api/axiosInterceptorAPI";

export default async function adminLogout(props: logoutProps): Promise<any> {
  try {
    const response = await axiosInstance.post(
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
    props.navigate("/admin");
    return { status: false };
  }
}
