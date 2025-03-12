import { format, isFuture, differenceInMinutes } from "date-fns";
import {
  Video,
  User,
  FileText,
  Clock,
  Calendar,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MeetDetailsPart = ({ meetData }: { meetData: any }) => {
  const navigate = useNavigate();
  const meet = meetData;

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Check if the meeting is in the future
  const meetDate = new Date(meet.meet_date);
  const isUpcoming = isFuture(meetDate);

  const isJoinable =
    isUpcoming || differenceInMinutes(new Date(), meetDate) < 15;

  const handleUserInfoClick = () => {
    navigate(`/admin/users/user-details/${meet.user_id}`);
  };

  const handleRequestInfoClick = () => {
    navigate(`/admin/redeem-requests/details/${meet.request_id}`);
  };

  const handleJoinMeeting = () => {
    navigate(`/video-call?id=${meet._id}`);
    console.log(`Joining meeting with ID: ${meet._id}`);
  };

  // Handle back button
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="bg-blue-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-900 p-4 flex justify-between items-center">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-300 hover:text-white transition duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Meetings</span>
        </button>
      </div>

      {/* Meeting Details Card */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          {/* Left Column - Meeting Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-6">
              Meeting Details
            </h1>

            <div className="bg-blue-700 rounded-lg p-5 shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {meet.user_name}
                  </h2>
                  <p className="text-blue-300 text-sm">{meet.user_id}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-300 mr-3" />
                  <span className="text-white">
                    {formatDate(meet.meet_date)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-300 mr-3" />
                  <span className="text-white">
                    {formatTime(meet.meet_date)}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-300 mr-3" />
                  <span className="text-white">
                    Request ID: {meet.request_id}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-600">
                <p className="text-sm text-blue-300 mb-2">
                  Meeting created on {formatDate(meet.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="flex flex-col gap-4 md:w-72">
            <button
              onClick={handleJoinMeeting}
              className={`py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transition duration-200 ${
                isJoinable
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!isJoinable}
            >
              <Video className="w-5 h-5 mr-2" />
              {isJoinable ? "Join Meeting" : "Meeting Expired"}
            </button>

            <button
              onClick={handleUserInfoClick}
              className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-between shadow-md transition duration-200"
            >
              <span className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                View User Profile
              </span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleRequestInfoClick}
              className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-between shadow-md transition duration-200"
            >
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                View Request Details
              </span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="bg-blue-700 rounded-lg p-4 mt-4">
              <h3 className="text-white text-sm font-medium mb-2">
                Meeting ID
              </h3>
              <p className="bg-blue-800 p-2 rounded text-blue-300 text-sm font-mono break-all">
                {meet._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetDetailsPart;
