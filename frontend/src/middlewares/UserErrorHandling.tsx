import { showErrorToast2 } from "../utils/iziToastUtils";
import { removeUserDetails } from "../redux/slice/userDetailsSlice";
import { removeAccessToken } from "../redux/slice/accessTokenSlice";
import userLogout from "../api/auth-api/userLogoutAPI";

const UserErrorHandling = async (error: any, dispatch: any, navigate: any) => {
  try {
    if (error.status == 403) {
      dispatch(removeUserDetails());
      dispatch(removeAccessToken());
      navigate("/login");
      await userLogout();
      showErrorToast2(error.data.message);
    } else if (error.status == 400) {
      showErrorToast2(error.data.message);
    } else {
      console.log(error.status, "Error not defined on the UserErrorHandling");
    }
  } catch (error) {
    console.log("Error on the UserErrorHandling.tsx file", error);
  }
};

export default UserErrorHandling;
