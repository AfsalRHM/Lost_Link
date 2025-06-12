import { useEffect, useState } from "react";
import { defineCustomElements } from "ionicons/dist/loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <header className="bg-header shadow-md md:px-16 px-4 py-3">
      <nav className="flex justify-between items-center w-full mx-auto max-w-screen-xl">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <img
            className="w-11 rounded-2xl p-1 shadow-sm"
            src="/Logo.png"
            alt="LostLink Logo"
          />
          <p className="text-2xl font-bold tracking-wide">LostLink</p>
        </motion.div>

        {/* Navigation Links */}
        <div className="nav-links duration-500 md:static absolute bg-header md:w-auto w-full left-0 top-[-100%] md:min-h-fit min-h-[6vh] flex items-center px-5 mt-3 md:mt-0 border-b md:border-none z-10">
          <ul className="flex md:flex-row flex-col items-start md:items-center gap-4 md:gap-[2vw] w-full">
            {["Home", "About Us", "Contact", "FAQ's"].map((item, idx) => (
              <motion.li
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="py-1 px-3 rounded-full hover:bg-[#8695ae] transition-all duration-300 cursor-pointer"
              >
                {item === "Contact" && scrollToContact !== undefined ? (
                  <p
                    onClick={scrollToContact}
                    className="text-[15px] font-medium"
                  >
                    Contact
                  </p>
                ) : item === "About Us" ? (
                  <Link to="/about-us">
                    <p className="text-[15px] font-medium">{item}</p>
                  </Link>
                ) : (
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(/ /g, "-")}`
                    }
                  >
                    <p className="text-[15px] font-medium">{item}</p>
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Sign In + Menu */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-5"
        >
          <Link to="/signin">
            <button className="bg-[#a6c1ee] text-black text-sm md:text-lg px-4 py-2 rounded-full hover:bg-[#87acec] border shadow-lg transition-all duration-300 font-semibold">
              Sign In
            </button>
          </Link>

          {/* Mobile Menu Icon */}
          <div className="text-2xl cursor-pointer md:hidden">
            <ion-icon name="menu" onClick={onToggleMenu}></ion-icon>
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
