import axiosInstance from "../axios-api/axiosInterceptorAPI";

interface Props {
  accessToken: string;
  navigate: any;
  setAccessToken: any;
  dispatch: any;
  removeUserDetails: any;
}

export default async function getProfile(props: Props): Promise<any> {
  try {
    const response = await axiosInstance.get(
      import.meta.env.VITE_GET_PROFILE ||
        "http://localhost:7000/user/getProfile",
      {
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
    );

    const newAccessToken = response.headers["authorization"].split(" ")[1];
    props.dispatch(props.setAccessToken(newAccessToken));
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    props.dispatch(props.removeUserDetails());
    props.navigate("/signin");
    return { status: false };
  }
}
