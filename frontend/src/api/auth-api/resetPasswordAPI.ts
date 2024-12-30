import axios from "axios";

type propsType = {
    recieverEmail: string;
    recieverName: string;
};

export default async function sendResetPasswordMail(props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(import.meta.env.VITE_IS_USER_RESET_PASSWORD_OTP, props)
      .then((response) => {
        console.log(response.status, response.data);
        return response.data
      });
      return result;
  } catch (error) {
    console.log(error);
  }
}
