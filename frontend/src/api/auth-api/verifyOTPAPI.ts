import axios from "axios";

type propsType = {
  userEmail: string;
  userEnteredOTP: string;
};

export default async function verifyOTP(props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(`${import.meta.env.VITE_API_ROUTE}/auth/verify-otp`, props)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error: any) {
    console.log(error, "Error on the verifyOTPAPI");
    return error.response;
  }
}
