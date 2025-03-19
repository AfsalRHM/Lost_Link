import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import fetchUserMeetings from "../../../api/user-api/getUserMeetingsAPI";
import { useNavigate } from "react-router-dom";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

// Meeting data type definition
type MeetingType = {
  _id: string;
  meet_date: string; // ISO date string
  meet_time: string; // 12-hour format with AM/PM
  status?: "upcoming" | "finished";
  meet_end?: string;
};

const MeetingSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<string>("upcoming");
  const [meetings, setMeetings] = useState<MeetingType[]>([]);

  const { userId } = useSelector((state: RootState) => state.userDetails);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetchUserMeetings({ userId });

        if (response.status == 200) {
          const fetchedMeetings: MeetingType[] = response.data.data;

          const updatedMeetings: MeetingType[] = fetchedMeetings.map(
            (meeting) => {
              const meetDate = new Date(meeting.meet_date)
                .toISOString()
                .split("T")[0];
              const meetTime = convertTo24Hour(`${meeting.meet_time}:00`);

              const meetingStart = new Date(`${meetDate}T${meetTime}`);
              const meetingEnd = new Date(meetingStart); // Clone the date
              meetingEnd.setMinutes(meetingEnd.getMinutes() + 15);

              const status: "upcoming" | "finished" =
                new Date() > meetingEnd ? "finished" : "upcoming";

              return { ...meeting, status, meet_end: meetingEnd.toString() };
            }
          );

          setMeetings(updatedMeetings);
        } else {
          console.log(
            response,
            "this is the error response on fetchUserMeetings"
          );
          UserErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(
    (meeting) => meeting.status === currentTab
  );

  // Sort meetings by date and time
  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    return (
      new Date(`${a.meet_date}T${convertTo24Hour(a.meet_time)}`).getTime() -
      new Date(`${b.meet_date}T${convertTo24Hour(b.meet_time)}`).getTime()
    );
  });

  // Helper function to convert time to 24-hour format
  function convertTo24Hour(timeStr: string) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
    return `${hours}:${minutes}:00`;
  }

  // Helper function to convert 24-hour format (e.g., "14:30:00") to 12-hour format (e.g., "02:30 PM")
  function convertTo12Hour(timeStr: string) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  }

  // Function to check if meeting is active now
  function isMeetingActive(meeting: MeetingType) {
    const now = new Date();
    const meetDate = new Date(meeting.meet_date).toISOString().split("T")[0];
    const meetTime = convertTo24Hour(`${meeting.meet_time}:00`);

    const meetingStart = new Date(`${meetDate}T${meetTime}`);

    const meetingEnd = new Date(meetingStart); // Clone the date
    meetingEnd.setMinutes(meetingEnd.getMinutes() + 15);

    return now >= meetingStart && now <= meetingEnd;
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const formateTo12Hour = (meetingEnd: string) => {
    const newData = new Date(meetingEnd);
    return newData.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Meetings
      </h2>

      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        {["upcoming", "finished"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`text-sm font-medium capitalize focus:outline-none ${
              currentTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meetings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Meet Id
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Time
              </th>
              {currentTab === "upcoming" && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedMeetings.length > 0 ? (
              sortedMeetings.map((meeting) => {
                return (
                  <tr
                    key={meeting._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {meeting._id.slice(0, 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {formatDate(meeting.meet_date)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {convertTo12Hour(meeting.meet_time)} -{" "}
                      {formateTo12Hour(meeting.meet_end!)}
                    </td>
                    {currentTab === "upcoming" && (
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => {
                            navigate(`/video-call?id=${meeting._id}`);
                          }}
                          disabled={!isMeetingActive(meeting)}
                          className={`py-1 px-3 rounded-md text-xs font-medium transition-colors ${
                            isMeetingActive(meeting)
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                        >
                          Join Meeting
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={currentTab === "upcoming" ? 4 : 3}
                  className="px-6 py-3 text-sm text-center text-gray-500"
                >
                  No {currentTab} meetings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingSection;
