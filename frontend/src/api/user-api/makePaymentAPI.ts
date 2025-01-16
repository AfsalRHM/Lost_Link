import { RequestProps } from "../../interface/IrequestProps";
import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  accessToken: string;
  formData: RequestProps;
}

export default async function makePayment(props: Props): Promise<any> {
  try {
    const formData = props.formData;
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/create_checkout_session`,
      {formData},
      {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Error Making Payment:", error);
    return false;
  }
}
