import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  accessToken: string;
}

export default async function getAllRequests(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_ROUTE}/request/getAllRequests`,
      {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
    );

    // const newAccessToken = response.headers["authorization"].split(" ")[1];
    // // props.dispatch(props.setAccessToken(newAccessToken));
    console.log(response.data.data, "this is all the reques from the getAllRequestAPI")
    return response;
  } catch (error) {
    console.error("Error fetching All Requests:", error);
    // props.dispatch(props.removeUserDetails());
    // props.navigate("/signin");
    return false;
  }
}
