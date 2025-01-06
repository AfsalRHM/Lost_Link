import axios from "axios";

type propsType = {
  userEmail: string;
  newPassword: string;
};

export default async function changePassword(props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(`${import.meta.env.VITE_API_ROUTE}/auth/resetPassword`, props)
      .then((response) => {
        console.log(response.status, response.data);
        return response.data;
      });
    return result;
  } catch (error) {
    console.log(error);
  }
}
