import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

interface propsType {
  adminId: string;
}

export default async function changeAdminStatus(
  Props: propsType
): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(
        `${import.meta.env.VITE_API_ROUTE}/admin/changeAdminStatus`,
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
