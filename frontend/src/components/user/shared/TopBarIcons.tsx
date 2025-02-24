import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faComment } from "@fortawesome/free-solid-svg-icons";

const TopBarIcons = () => {
  const { currentPage } = useSelector((state: RootState) => state.currentPage);

  const linkClass =
    "rounded-full p-1 transition-all ease-in-out duration-300 hidden md:inline-flex";
  const hoverClass = "hover:bg-[#ccdfff]";
  const activeClass = "bg-[#ccdfff]"; // Permanent background color for the active page

  return (
    <>
      <Link to="/contact">
        <div
          className={`${linkClass} ${
            currentPage === "/contact" ? activeClass : hoverClass
          }`}
          title="Contact"
        >
          <FontAwesomeIcon icon={faComment} style={{ fontSize: "20px" }} />
        </div>
      </Link>

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

      <Link to="/notifications">
        <div
          className={`${linkClass} ${
            currentPage === "/notifications" ? activeClass : hoverClass
          }`}
          title="Notifications"
        >
          <ion-icon
            name="notifications-outline"
            style={{ fontSize: "20px" }}
          ></ion-icon>
        </div>
      </Link>

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
