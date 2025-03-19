import axios from "axios";

type propsType = {
  recieverName: string;
  recieverEmail: string;
};

export default async function sendMail(props: propsType) {
  try {
    const result = await axios
      .post(`${import.meta.env.VITE_API_ROUTE}/auth/send-mail`, props)
      .then((response) => {
        return response;
      });
    return result;
  } catch (error: any) {
    console.log(error, "Error on the sendMailAPi");
    return error.response;
  }
}
