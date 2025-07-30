import { userService } from "../services/userService";

import { showErrorToast2 } from "../utils/iziToastUtils";
import { removeUserDetails } from "../redux/slice/userDetailsSlice";
import { removeAccessToken } from "../redux/slice/accessTokenSlice";

const UserErrorHandling = async (error: any, dispatch: any, navigate: any) => {
  try {
    if (error.status == 403) {
      dispatch(removeUserDetails());
      dispatch(removeAccessToken());
      navigate("/login");
      await userService.logout();
      showErrorToast2(error.data.message);
    } else if (error.status == 400) {
      showErrorToast2(error.data.message);
    } else if (error.status == 404) {
      navigate("/404");
    } else {
      console.log(error.status, "Error not defined on the UserErrorHandling");
    }
  } catch (error) {
    console.log("Error on the UserErrorHandling.tsx file", error);
  }
};

export default UserErrorHandling;
