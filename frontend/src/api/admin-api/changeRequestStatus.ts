import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface propsType {
  requestId: string;
}

export default async function changeRequestStatus(Props: propsType): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(
        `${import.meta.env.VITE_API_ROUTE}/request/changeRequestStatus`,
        { Props },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the changeRequestStatusAPI");
    return false;
  }
}