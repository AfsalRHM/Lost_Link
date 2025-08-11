import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { adminService } from "../../../services/adminService";

type Request = {
  id: string;
  productName: string;
  productCategory: string;
  status: string;
  rewardAmount: number;
  createdAt: Date;
};

import { Sidebar } from "../shared/Sidebar";
import RequestListPart from "./RequestListPart";
import NavBar from "../shared/Navbar";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";

const RequestListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestList, setRequestList] = useState<Request[]>([]);

  const getAllRequest = async () => {
    try {
      const response = await adminService.getRequests();

      if (response.status == 200) {
        setRequestList(response.data.data);
      } else {
        console.log(response, "this is the error response");
        AdminErrorHandling(response, dispatch, navigate);
      }
    } catch (error) {
      console.error("Error in getAllRequests:", error);
    }
  };

  useEffect(() => {
    getAllRequest();
  }, []);

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-blue-800 shadow-md z-10 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64">
        <NavBar setSidebarOpen={setSidebarOpen} />

        <main className="p-6">
          <RequestListPart
            allRequests={requestList}
            allRequestsFunc={getAllRequest}
            setRequestList={setRequestList}
          />
        </main>
      </div>
    </div>
  );
};

export default RequestListPage;
