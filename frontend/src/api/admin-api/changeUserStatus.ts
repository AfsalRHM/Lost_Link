import axios from "axios";

interface propsType {
  userId: string;
}

export default async function changeStatus(Props: propsType): Promise<any> {
  try {
    const result = await axios
      .post(
        `${import.meta.env.VITE_API_ROUTE}/admin/changeUserStatus`,
        { Props },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the changeUserStatusAPI");
  }
}
