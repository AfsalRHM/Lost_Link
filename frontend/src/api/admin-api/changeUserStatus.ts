import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface propsType {
  userId: string | undefined;
}

export default async function changeStatus(Props: propsType): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(
        `${import.meta.env.VITE_API_ROUTE}/admin/changeUserStatus`,
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
    console.log(error, "error on the changeUserStatusAPI");
    return false;
  }
}
