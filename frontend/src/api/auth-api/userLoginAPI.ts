import axios from "axios";

type propsType = {
  userEmail: string;
  userPassword: string;
};

export default async function userLogin(props: propsType): Promise<any> {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_API_ROUTE}/auth/login-verify`,
      props,
      {
        withCredentials: true,
      }
    );

    const authorizationHeader = result.headers["authorization"];
    const data = result;

    return { data, authorizationHeader };
  } catch (error: any) {
    console.error("Login Error:", error);
    return {data: error.response};
  }
}
