import axios from "axios";

type propsType = {
  userFullName: string;
  userName: string;
  userLocation: string;
  userEmail: string;
  userPassword: string;
};

export default async function insertUser(props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(`${import.meta.env.VITE_API_ROUTE}/auth/insert-user`, props)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error: any) {
    console.log(error, "Error on the saveUserAPI");
    return error.response;
  }
}
