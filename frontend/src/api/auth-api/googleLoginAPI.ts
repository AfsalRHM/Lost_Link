import axios from "axios";

export default async function googleLogin(email: string): Promise<any> {
  try {
    const result = await axios
      .post(
        `${import.meta.env.VITE_API_ROUTE}/auth/googleLogin`,
        { email },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("this is from here", response.status);
        return response;
      });
    return result;
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      return error.response;
    }
    return { status: 500, message: "Something went wrong" };
  }
}
