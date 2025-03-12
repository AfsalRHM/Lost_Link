import { useEffect, useState } from "react";
import { Sidebar } from "../shared/Sidebar";
import MeetDetailsPart from "./MeetDetailsPart";
import NavBar from "../shared/Navbar";
import adminLogout from "../../../api/admin-api/adminLogoutAPI";
import { useAdminJwtErrors } from "../../../utils/JwtErrors";
import { useParams } from "react-router-dom";
import fetchMeetData from "../../../api/admin-api/getMeetDetailsAPI";

const MeetDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetData, setMeetData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const JwtErrors = useAdminJwtErrors();
  const { meetId } = useParams<{ meetId: string }>();

  const getMeetData = async () => {
    if (!meetId) return;

    try {
      setLoading(true);
      const response = await fetchMeetData({ meetId });

      if (response?.data?.status) {
        setMeetData(response.data.data);
      } else if (response === false) {
        JwtErrors({ reason: "session expiration" });
        try {
          await adminLogout();
        } catch (logoutError) {
          console.error("Error during admin logout:", logoutError);
        }
      } else {
        console.error("Unexpected response:", response);
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
