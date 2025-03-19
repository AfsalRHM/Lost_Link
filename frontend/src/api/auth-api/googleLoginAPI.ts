import axios from "axios";

export default async function googleLogin(email: string): Promise<any> {
  try {
    const result = await axios
      .post(
        `${import.meta.env.VITE_API_ROUTE}/auth/google-login`,
        { email },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error: any) {
    console.log(error, "Error on the googleLoginAPI");
    return error.response;
  }
}
