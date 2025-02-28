import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import changeUserNotificationSeen from "../../api/user-api/changeUserNotificationSeenAPI";
import changeAdminNotificationSeen from "../../api/admin-api/changeAdminNotificationSeenAPI";

const NotificationSection = ({ Notifications }: { Notifications: any[] }) => {
  const navigate = useNavigate();

  console.log("Notifications", Notifications);

  const { userId } = useSelector((state: RootState) => state.userDetails);

  async function makeUserNotificationSeen() {
    await changeUserNotificationSeen({ userId });
  }
  async function makeAdminNotificationSeen() {
    await changeAdminNotificationSeen();
  }

  useEffect(() => {
    if (userId) {
      makeUserNotificationSeen();
    } else {
      makeAdminNotificationSeen();
    }
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg p-3 border z-50">
      <h3 className="text-sm font-semibold mb-2">Notifications</h3>
      <ul className="text-sm">
        {Notifications.length > 0 ? (
          Notifications.slice(0, 4).map((notification, index) => (
            <li
              key={index}
              className="p-2 border-b cursor-pointer hover:bg-gray-100 transition"
              onClick={() => {
                if (notification.sender == "user") {
                  navigate(`/admin/chats/chat-details/${notification.chat_id}`);
                } else {
                  navigate(`/my_request_details`, {
                    state: { requestId: notification.request_id },
                  });
                }
              }}
            >
              🔔{" "}
              {notification.sender == "user"
                ? "New message from User"
                : "New message from Admin"}
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No new notifications</li>
        )}
      </ul>
      {Notifications.length > 4 && (
        <button
          onClick={() => navigate("/notifications")}
          className="mt-2 w-full text-blue-500 text-sm font-semibold hover:underline"
        >
          View all notifications
        </button>
      )}
    </div>
  );
};

export default NotificationSection;
