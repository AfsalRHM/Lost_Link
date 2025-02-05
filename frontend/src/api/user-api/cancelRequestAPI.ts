import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface propsType {
  requestId: string;
}

export default async function cancelRequest(Props: propsType): Promise<any> {
  try {
    const result = await axiosInstance
      .patch(`${import.meta.env.VITE_API_ROUTE}/request/cancelRequest`, Props)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the cancelRequestAPI");
    return false;
  }
}
