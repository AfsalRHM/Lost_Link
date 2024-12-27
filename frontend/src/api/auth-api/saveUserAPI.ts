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
      .post(import.meta.env.VITE_SAVE_USER_API || "http://localhost:7000/auth/insertUser1", props)
      .then((response) => {
        console.log(response.status, response.data);
        return response.data
      });
      return result;
  } catch (error) {
    console.log(error);
  }
}
