import { formDataType } from "../../interface/IuserModel";
import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  formData: formDataType;
}

export default async function saveUpdatedData(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.patch(
      `${import.meta.env.VITE_API_ROUTE}/user/update-user`,
      props
    );

    return response;
  } catch (error: any) {
    console.error("Error Creating Request:", error);
    return error.response;
  }
}
