import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const TopBar = () => {
  const { currentPage } = useSelector((state: RootState) => state.currentPage);

  const linkClass =
    "py-[2px] px-[4px] rounded-full transition-all ease-in-out duration-300";
  const hoverClass = "hover:bg-[#ccdfff]";
  const activeClass = "bg-[#ccdfff]";

  return (
    <>
      <Link to="/home">
        <li
          className={`${linkClass} ${
            currentPage === "/home" ? activeClass : hoverClass
          }`}
        >
          <span className="text-[15px] font-medium">Home</span>
        </li>
      </Link>

      <Link to="/requests">
        <li
          className={`${linkClass} ${
            currentPage === "/requests" ? activeClass : hoverClass
          }`}
        >
          <span className="text-[15px] font-medium">Requests</span>
        </li>
      </Link>

      <Link to="/create_request">
        <li
          className={`${linkClass} ${
            currentPage === "/create_request" ? activeClass : hoverClass
          }`}
        >
          <span className="text-[15px] font-medium">Create Request</span>
        </li>
      </Link>

      <Link to="/about-us">
        <li
          className={`${linkClass} ${
            currentPage === "/about-us" ? activeClass : hoverClass
          }`}
        >
          <span className="text-[15px] font-medium">About Us</span>
        </li>
      </Link>

      {/* <Link to="/contact">
        <li
          className={`${linkClass} ${
            currentPage === "/contact" ? activeClass : hoverClass
          } md:hidden`}
        >
          <span className="text-[15px] font-medium">Contact</span>
        </li>
      </Link> */}

      <Link to="/faq">
        <li
          className={`${linkClass} ${
            currentPage === "/faq" ? activeClass : hoverClass
          } md:hidden pb-4`}
        >
          <span className="text-[15px] font-medium">
            Frequently Asked Questions (FAQ)
          </span>
        </li>
      </Link>
    </>
  );
};

export default TopBar;
