import { RequestProps } from "../../interface/IrequestProps";
import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  accessToken: string;
  formData: RequestProps;
}

export default async function createRequest(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/create_request`,
      props.formData
    );

    return response;
  } catch (error) {
    console.error("Error Creating Request:", error);
    return false;
  }
}
