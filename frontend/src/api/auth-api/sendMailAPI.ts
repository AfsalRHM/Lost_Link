import axios from "axios";

type propsType = {
  recieverName: string;
  recieverEmail: string;
};

export default async function sendMail(props: propsType) {
  try {
    const result = await axios
      .post(import.meta.env.VITE_SEND_MAIL_API, props)
      .then((response) => {
        return response.data;
      });
    return result;
  } catch (error) {
    console.log(error);
  }
}
