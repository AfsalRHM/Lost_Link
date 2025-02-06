import { RequestRedeemProps } from "../../interface/IrequestProps";
import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  formData: RequestRedeemProps;
  requestId: string
}

export default async function saveRedeemRequest(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_ROUTE}/request/create-redeem-request`,
      props
    );

    return response;
  } catch (error) {
    console.error("Error Creating Request:", error);
    return false;
  }
}
