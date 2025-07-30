import { adminService } from "../services/adminService";

import { showErrorToast2 } from "../utils/iziToastUtils";
import { removeAdminAccessToken } from "../redux/slice/accessTokenSlice";
import { removeAdminDetails } from "../redux/slice/adminDetailsSlice";

const AdminErrorHandling = async (error: any, dispatch: any, navigate: any) => {
  try {
    if (error.status == 403) {
      dispatch(removeAdminDetails());
      dispatch(removeAdminAccessToken());
      navigate("/admin/login");
      await adminService.logout();
      showErrorToast2(error.data.message);
    } else if (error.status == 404) {
      navigate("/admin/404");
    } else {
      console.log(error.status, "Error not defined on the AdminErrorHandling");
    }
  } catch (error) {
    console.log("Error on the AdminErrorHandling.tsx file", error);
  }
};

export default AdminErrorHandling;
