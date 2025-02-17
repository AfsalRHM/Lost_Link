import axios from "axios";

type propsType = {
  userEmail: string;
  userEnteredOTP: string;
};

export default async function verifyOTP(props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(`${import.meta.env.VITE_API_ROUTE}/auth/verifyOTP`, props)
      .then((response) => {
        return response.data;
      });
    return result;
  } catch (error) {
    console.log(error);
  }
}
