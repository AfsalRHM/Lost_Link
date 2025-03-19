import axios from "axios";

type propsType = {
  userEmail: string;
  newPassword: string;
};

export default async function changePassword(props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(`${import.meta.env.VITE_API_ROUTE}/auth/reset-password`, props)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error);
  }
}
