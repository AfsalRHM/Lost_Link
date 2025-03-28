import { useEffect, useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import MeetDetailsPart from "./MeetDetailsPart";
import NavBar from "../shared/Navbar";
import { useParams } from "react-router-dom";
import fetchMeetData from "../../../api/admin-api/getMeetDetailsAPI";
import AdminErrorHandling from "../../../middlewares/AdminErrorHandling";
import { useDispatch } from "react-redux";

const MeetDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetData, setMeetData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { meetId } = useParams<{ meetId: string }>();

  const getMeetData = async () => {
    if (!meetId) return;

    try {
      setLoading(true);
      const response = await fetchMeetData({ meetId });

      if (response.status == 200) {
        setMeetData(response.data.data);
      } else {
        console.log(response, "this is the error response on fetchMeetData");
        AdminErrorHandling(response, dispatch, navigate);
      }
    } catch (error) {
      console.error("Error in getMeetData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMeetData();
  }, [meetId]);

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
          {loading ? (
            <p className="text-center text-lg">Loading...</p>
          ) : meetData ? (
            <MeetDetailsPart meetData={meetData} />
          ) : (
            <p className="text-center text-lg">No meeting details found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default MeetDetailsPage;
