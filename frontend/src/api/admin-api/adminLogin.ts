import axios from "axios";
import { LoginFormData } from "../../interface/IloginForm";

export default async function adminLogin(props: LoginFormData): Promise<any> {
  try {
    const result = await axios
      .post(import.meta.env.VITE_ADMIN_LOGIN, props, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.status, response.data);
        return response;
      });
    const authorizationHeader = result.headers["authorization"];
    const data = result;

    return { data, authorizationHeader };
  } catch (error) {
    console.log(error);
  }
}
