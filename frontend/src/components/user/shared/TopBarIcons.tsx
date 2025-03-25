import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { RootState } from "../../../redux/store";
import NotificationSection from "../../shared/NotificationSection";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import getNotifications from "../../../api/user-api/getNotificationsAPI";
import { getNotifSocket } from "../../../socket/socket";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

const TopBarIcons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPage } = useSelector((state: RootState) => state.currentPage);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);

  const notifSocket = getNotifSocket();
  notifSocket.emit("joinRoom", "admin");

  const linkClass =
    "rounded-full p-1 transition-all ease-in-out duration-300 hidden md:inline-flex";
  const hoverClass = "hover:bg-[#ccdfff]";
  const activeClass = "bg-[#ccdfff]";

  const userId = useSelector((state: RootState) => state.userDetails.userId);

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

  useEffect(() => {
    notifSocket.on("userNewNotification", (newNotificationRecieved: any) => {
      setNotifications([...notifications, newNotificationRecieved]);
    });
  });

  useEffect(() => {
    const getNotificationData = async () => {
      try {
        const response = await getNotifications({
          userId,
        });

        if (response.status === 200) {
          setNotifications(response.data.data);
        } else {
          console.log(
            response,
            "this is the error response on getNotifications"
          );
          UserErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Failed to fetch Notifications:", error);
      }
    };

    getNotificationData();
  }, []);

  return (
    <>
      {/* <Link to="/contact">
        <div
          className={`${linkClass} ${
            currentPage === "/contact" ? activeClass : hoverClass
          }`}
          title="Contact"
        >
          <FontAwesomeIcon icon={faComment} style={{ fontSize: "20px" }} />
        </div>
      </Link> */}

      <Link to="/faq">
        <div
          className={`${linkClass} ${
            currentPage === "/faq" ? activeClass : hoverClass
          } px-2`}
          title="FAQ's"
        >
          <FontAwesomeIcon icon={faQuestion} style={{ fontSize: "20px" }} />
        </div>
      </Link>

      {/* Notifications Icon with Dropdown */}
      <div className="relative" ref={notificationRef}>
        <button
          className={`rounded-full p-2 inline-flex transition-all ease-in-out duration-300 cursor-pointer ${
            currentPage === "/notifications" ? activeClass : hoverClass
          }`}
          title="Notifications"
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <ion-icon
            name="notifications-outline"
            style={{ fontSize: "20px" }}
          ></ion-icon>

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-0 transform translate-x-1 translate-y-1 bg-red-500 text-white text-xs font-bold px-2 py-[2px] rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Render NotificationSection when showNotifications is true */}
        {showNotifications && (
          <NotificationSection from="user" Notifications={notifications} />
        )}
      </div>

      <Link to="/profile">
        <div
          className={`rounded-full p-2 inline-flex transition-all ease-in-out duration-300 cursor-pointer ${
            currentPage === "/profile" ? activeClass : hoverClass
          }`}
          title="Profile"
        >
          <ion-icon
            name="person-outline"
            style={{ fontSize: "25px" }}
          ></ion-icon>
        </div>
      </Link>
    </>
  );
};

export default TopBarIcons;
