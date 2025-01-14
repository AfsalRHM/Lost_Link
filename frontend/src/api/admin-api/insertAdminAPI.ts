import { adminProps } from "../../interface/IapiProps";
import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function insertAdmin(Props: adminProps): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .post(
        `${import.meta.env.VITE_API_ROUTE}/admin/addAdmin`,
        { Props },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response;
      });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error, "error on the insertAdminAPI");
    return false;
  }
}
