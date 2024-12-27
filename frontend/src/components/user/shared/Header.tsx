import { defineCustomElements } from "ionicons/dist/loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import getProfile from "../../../api/user-api/getProfileAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { assignAccessToken } from "../../../redux/slice/accessTokenSlice";
import { removeUserDetails } from "../../../redux/slice/userDetailsSlice";
import TopBar from "./TopBar";
import TopBarIcons from "./TopBarIcons";

const Header = () => {
  useEffect(() => {
    defineCustomElements(window);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const { accessToken } = useSelector((state: RootState) => state.accessToken);

  const onToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    const navLinks = document.querySelector(".nav-links");
    const target = e.currentTarget as HTMLElement;
    setMenuOpen(!menuOpen);
    target.setAttribute("name", menuOpen ? "menu" : "close");
    navLinks?.classList.toggle("top-[9%]");
  };

  async function handleProfile() {
    const result = await getProfile({
      accessToken,
      navigate,
      setAccessToken: assignAccessToken,
      dispatch,
      removeUserDetails: removeUserDetails,
    });
    if (result.status) {
      navigate("/profile");
    } else {
      console.log("Nothing is getting");
    }
  }

  return (
    <header className="bg-header shadow-2xl border-y md:px-16 p-3 z-10">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <div className="flex items-center">
          <img className="w-11 rounded-2xl p-1" src="/Logo.png" alt="" />
          <p className="text-xl font-bold">LostLink</p>
        </div>
        <div className="nav-links duration-500 md:static absolute bg-header min-h-[6vh] left-0 top-[-100%] md:w-auto w-full flex items-center px-5 mt-3 md:mt-0 border-b md:border-b-0">
          <ul className="flex md:flex-row flex-col md:min-h-fit md:items-center md:gap-[2vw] gap-2 mt-4 md:mt-0">
            <TopBar />
          </ul>
        </div>
        <div className="flex items-center gap-6 ">
          <TopBarIcons handleProfile={handleProfile} />
          <div className="text-xl cursor-pointer mt-1 md:hidden">
            <ion-icon name="menu" onClick={(e) => onToggleMenu(e)}></ion-icon>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
