import { Bell, Menu, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { showErrorToast2 } from "../../../utils/iziToastUtils";
import getAdminNotifications from "../../../api/admin-api/getNotificationsAPI";
import { getNotifSocket } from "../../../socket/socket";
import NotificationSection from "../../shared/NotificationSection";
import { useParams } from "react-router-dom";
import chageNotificaitonSeen from "../../../api/admin-api/changeNotificaitonSeenAPI";

interface navBarType {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({ setSidebarOpen }: navBarType) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();

  const notifSocket = getNotifSocket();

  notifSocket.emit("joinRoom", "admin");

  useEffect(() => {
    notifSocket.on("adminNewNotification", (newNotificationRecieved: any) => {
      if (id !== newNotificationRecieved.chat_id) {
        setNotifications([...notifications, newNotificationRecieved]);
      } else {
        makeNotificationSeen({notificationId: newNotificationRecieved._id});
      }
    });
  });

  async function makeNotificationSeen({notificationId}: {notificationId: string}) {
    await chageNotificaitonSeen({notificationId})
  }

  // Fetch notifications
  useEffect(() => {
    const getAdminNotificationData = async () => {
      try {
        const response = await getAdminNotifications();
        if (response.status === 200) {
          setNotifications(response.data.data);
        } else {
          showErrorToast2(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch Admin Notifications:", error);
      }
    };

    getAdminNotificationData();
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotifications([]);
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-blue-800 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
          <Menu size={24} className="text-white" />
        </button>

        {/* Search Box */}
        <div className="flex-1 mx-4 relative flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-1/3 p-2 rounded-l-lg bg-blue-700 text-white focus:outline-none transition-all ease-in-out duration-300 shadow-lg"
          />
          <button className="p-2.5 rounded-r-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none transition-all ease-in-out duration-300 shadow-lg hover:scale-105">
            <Search size={20} />
          </button>
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center space-x-4 relative">
          {/* Notification Icon */}
          <div className="relative" ref={notificationRef}>
            <button
              className="p-2 hover:bg-blue-700 rounded-lg transition-all ease-in-out duration-300 relative"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <Bell size={22} className="text-white" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-0 transform translate-x-1 translate-y-1 bg-red-500 text-white text-xs font-bold px-2 py-[2px] rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <NotificationSection from="admin" Notifications={notifications} />
            )}
          </div>

          {/* Profile Icon */}
          <div className="w-8 h-8 bg-blue-500 rounded-full transition-all ease-in-out duration-300"></div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
