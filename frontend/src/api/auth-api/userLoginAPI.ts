import axios from "axios";

type propsType = {
  userEmail: string;
  userPassword: string;
};

export default async function userLogin(props: propsType): Promise<any> {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_API_ROUTE}/auth/loginVerify`,
      props,
      {
        withCredentials: true,
      }
    );

    const authorizationHeader = result.headers["authorization"];
    const data = result.data;

    return { data, authorizationHeader };
  } catch (error) {
    console.error("Login Error:", error);
  }
}
