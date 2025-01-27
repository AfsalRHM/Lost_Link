import adminAxiosInstance from "../axios-api/adminAxiosInterceptorAPI";

export default async function fetchAllUsers(): Promise<any> {
  try {
    const result = await adminAxiosInstance
      .get(`${import.meta.env.VITE_API_ROUTE}/user/allUsers`, {
        withCredentials: true,
      })
      .then((response) => {
        return response;
      });
    return result;
  } catch (error) {
    console.log(error, "error on the allUsersAPI");
    return false;
  }
}
