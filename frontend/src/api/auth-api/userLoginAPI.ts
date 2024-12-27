import axios from "axios";

type propsType = {
  userEmail: string;
  userPassword: string;
};

export default async function userLogin(props: propsType): Promise<any> {
  try {
    const result = await axios.post(
      import.meta.env.VITE_USER_LOGIN_API,
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
