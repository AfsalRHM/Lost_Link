import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminListPage from "../../components/admin/admins-list/AdminListPage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { showErrorToast2 } from "../../utils/iziToastUtils";

const AdminList = () => {
  const navigate = useNavigate();
  const adminDetails = useSelector((state: RootState) => state.adminDetails);

  useEffect(() => {
    if (adminDetails.adminRole !== "Admin") {
      showErrorToast2("Access Denied (Only Admins Have Access)");
      navigate("/admin");
    }
  }, [adminDetails, navigate]);

  return <AdminListPage />;
};

export default AdminList;
