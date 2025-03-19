import { useEffect, useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";
import MeetListPart from "./MeetListPart";
import fetchAllMeets from "../../../api/admin-api/allMeetsAPI";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const MeetListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetList, setMeetList] = useState([]);

  const getAllMeets = async () => {
    try {
      const response = await fetchAllMeets();

      if (response.status == 200) {
        setMeetList(response.data.data);
      } else {
        console.log(response, "this is the error response on fetchAllMeets");
        AdminErrorHandling(response, dispatch, navigate);
      }
    } catch (error) {
      console.error("Error in getAllMeets:", error);
    }
  };

  useEffect(() => {
    getAllMeets();
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
          <MeetListPart allMeets={meetList} />
        </main>
      </div>
    </div>
  );
};

export default MeetListPage;
