import { showErrorToast2 } from "../utils/iziToastUtils";
import { removeAdminAccessToken } from "../redux/slice/accessTokenSlice";
import { removeAdminDetails } from "../redux/slice/adminDetailsSlice";
import adminLogout from "../api/admin-api/adminLogoutAPI";

const AdminErrorHandling = async (error: any, dispatch: any, navigate: any) => {
  try {
    if (error.status == 403) {
      dispatch(removeAdminDetails());
      dispatch(removeAdminAccessToken());
      navigate("/admin/login");
      await adminLogout();
      showErrorToast2(error.data.message);
    } else {
      console.log(error.status, "Error not defined on the AdminErrorHandling");
    }
  } catch (error) {
    console.log("Error on the AdminErrorHandling.tsx file", error);
  }
};

export default AdminErrorHandling;
