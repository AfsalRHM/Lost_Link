import { useEffect, useState } from "react";
import { defineCustomElements } from "ionicons/dist/loader";
import { Link } from "react-router-dom";

const Header = ({ scrollToContact }: { scrollToContact?: any }) => {
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

  return (
    <header className="bg-header shadow-lg md:px-16 p-3">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <div className="flex items-center">
          <img className="w-11 rounded-2xl p-1" src="/Logo.png" alt="" />
          <p className="text-xl font-bold">LostLink</p>
        </div>
        <div className="nav-links duration-500 md:static absolute bg-header min-h-[6vh] left-0 top-[-100%] md:w-auto w-full flex items-center px-5 mt-3 md:mt-0 border-b md:border-b-0">
          <ul className="flex md:flex-row flex-col md:min-h-fit md:items-center md:gap-[2vw] gap-2 mt-4 md:mt-0">
            <li className="py-[2px] px-[4px] rounded-full hover:bg-[#8695ae] transition-all ease-in-out duration-300">
              <Link to="/">
                <p className="text-[15px] font-medium">Home</p>
              </Link>
            </li>
            <li className="py-[2px] px-[4px] rounded-full hover:bg-[#8695ae] transition-all ease-in-out duration-300">
              <Link to="/about-us">
                <p className="text-[15px] font-medium">About Us</p>
              </Link>
            </li>
            <li className="py-[2px] px-[4px] rounded-full hover:bg-[#8695ae] transition-all ease-in-out duration-300">
              {scrollToContact == undefined ? (
                <Link to="/">
                  <p className="text-[15px] font-medium">Contact</p>
                </Link>
              ) : (
                <p
                  onClick={scrollToContact}
                  className="text-[15px] font-medium cursor-pointer"
                >
                  Contact
                </p>
              )}
            </li>
            <li className="py-[2px] px-[4px] rounded-full hover:bg-[#8695ae] transition-all ease-in-out duration-300">
              <Link to="/faq">
                <p className="text-[15px] font-medium">FAQ's</p>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-6 ">
          <Link to="/signin">
            <button className="bg-[#a6c1ee] text-black text-lg px-3 py-1 rounded-full hover:bg-[#87acec] border shadow-lg transition-all ease-in-out duration-300 font-medium md:mr-10">
              Sign In
            </button>
          </Link>
          <div className="text-xl cursor-pointer mt-1 md:hidden">
            <ion-icon name="menu" onClick={(e) => onToggleMenu(e)}></ion-icon>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
