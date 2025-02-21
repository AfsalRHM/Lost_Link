import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface propsType {
  redeemRequestId: string | undefined;
  changeTo: string;
}

export default async function changeRedeemRequestStatus(
  Props: propsType
): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(
        `${
          import.meta.env.VITE_API_ROUTE
        }/request/change-redeem-request-status`,
        { Props }
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the changeRedeemRequestStatusAPI");
    return false;
  }
}
