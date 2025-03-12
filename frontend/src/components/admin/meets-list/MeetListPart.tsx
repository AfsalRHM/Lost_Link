import { useState } from "react";
import { format, addMinutes, isAfter } from "date-fns";
import { Link } from "react-router-dom";

interface MeetListPartType {
  allMeets: any;
}

const MeetListPart = ({ allMeets }: MeetListPartType) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy • h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Current time
  const now = new Date();

  // Filter meetings based on active tab
  const filteredMeets = allMeets.filter((meet: any) => {
    const meetDate = new Date(meet.meet_date);
    const meetWithBuffer = addMinutes(meetDate, 15);
    return activeTab === "upcoming"
      ? isAfter(meetWithBuffer, now)
      : !isAfter(meetWithBuffer, now);
  });

  return (
    <div className="bg-blue-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Scheduled Meetings</h2>

        <div className="flex bg-blue-900 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white"
                : "text-blue-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeTab === "finished"
                ? "bg-blue-600 text-white"
                : "text-blue-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("finished")}
          >
            Finished
          </button>
        </div>
      </div>

      {filteredMeets.length === 0 ? (
        <div className="text-center py-16 text-blue-300">
          <p className="text-lg">No {activeTab} meetings found</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeets.map((meet: any) => (
            <div
              key={meet._id}
              className="bg-blue-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {meet.user_name}
                    </h3>
                    <p className="text-blue-300 text-sm">
                      {formatDate(meet.meet_date)}
                    </p>
                  </div>
                  <div
                    className={`rounded-full w-3 h-3 mt-1 ${
                      activeTab === "upcoming" ? "bg-green-400" : "bg-gray-400"
                    }`}
                  ></div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">User ID:</span>
                    <span className="text-white truncate ml-2 max-w-xs">
                      {meet.user_id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-blue-300">Request ID:</span>
                    <span className="text-white truncate ml-2 max-w-xs">
                      {meet.request_id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-800 p-3 flex justify-end">
                <Link to={`/admin/meetings/${meet._id}`}>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-md text-sm transition-colors duration-200">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetListPart;
