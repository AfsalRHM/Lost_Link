import axios from "axios";

interface adminProps {
  email: string;
  name: string;
  role: string;
  password: string;
  status: string;
}

export default async function insertAdmin(Props: adminProps): Promise<any> {
  try {
    const result = await axios
      .post(
        `${import.meta.env.VITE_API_ROUTE}/admin/addAdmin`,
        { Props },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response;
      });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error, "error on the insertAdminAPI");
  }
}
