import axios from "axios";

export default async function fetchAllAdmins(): Promise<any> {
  try {
    const result = await axios
      .post(
        `${import.meta.env.VITE_API_ROUTE}/admin/allAdmins`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the allUsersAPI");
  }
}
