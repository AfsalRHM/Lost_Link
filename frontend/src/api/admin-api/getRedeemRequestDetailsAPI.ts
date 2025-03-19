import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface Props {
  redeemRequestId: string | undefined;
}

export default async function fetchRedeemRequestDetails(
  props: Props
): Promise<any> {
  try {
    const response = await adminAxiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/get-redeem-request-details/${
        props.redeemRequestId
      }`
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
}
