import axios from "axios";

export default async function adminLogout(): Promise<any> {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ROUTE}/admin/logout`
    );

    return response;
  } catch (error) {
    console.error("Error while admin logs out:", error);
    return { status: false };
  }
}
