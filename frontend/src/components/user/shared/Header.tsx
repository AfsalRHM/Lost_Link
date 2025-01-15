import { defineCustomElements } from "ionicons/dist/loader";
import { useEffect, useState } from "react";

import TopBar from "./TopBar";
import TopBarIcons from "./TopBarIcons";

const Header = () => {
  useEffect(() => {
    defineCustomElements(window);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);


  const onToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    const navLinks = document.querySelector(".nav-links");
    const target = e.currentTarget as HTMLElement;
    setMenuOpen(!menuOpen);
    target.setAttribute("name", menuOpen ? "menu" : "close");
    navLinks?.classList.toggle("top-[9%]");
  };

  // useEffect(() => {
  //   async function handleProfile() {
  //     const result = await getProfile({
  //       accessToken,
  //       navigate,
  //       setAccessToken: assignAccessToken,
  //       dispatch,
  //       removeUserDetails: removeUserDetails,
  //     });
  //     if (result.status) {
  //       navigate("/profile");
  //     } else {
  //       console.log("Nothing is getting");
  //     }
  //   }
  // });

  return (
    <header className="bg-header shadow-2xl md:px-16 p-3 z-10">
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
          <TopBarIcons />
          <div className="text-xl cursor-pointer mt-1 md:hidden">
            <ion-icon name="menu" onClick={(e) => onToggleMenu(e)}></ion-icon>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
