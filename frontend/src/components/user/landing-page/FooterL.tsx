import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-footer w-full flex flex-col items-center py-12 px-4 gap-6 text-white"
    >
      {/* Logo */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <img
          className="w-14 rounded-full p-1 shadow-md"
          src="/Logo.png"
          alt="LostLink Logo"
        />
        <p className="text-2xl font-bold text-gray-300">LostLink</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap gap-6 justify-center text-lg text-gray-100 font-medium">
        <a href="/" className="hover:text-gray-400 transition duration-300">
          Home
        </a>
        <a
          href="/requests"
          className="hover:text-gray-400 transition duration-300"
        >
          Requests
        </a>
        <a
          href="#contact"
          className="hover:text-gray-400 transition duration-300"
        >
          Contact
        </a>
        <a
          href="/about-us"
          className="hover:text-gray-400 transition duration-300"
        >
          About
        </a>
      </nav>

      {/* Description */}
      <p className="w-11/12 md:w-2/3 text-center text-gray-300 leading-relaxed text-base">
        LostLink is dedicated to reconnecting you with what matters most.
        Whether you've lost something valuable or found an item that needs a
        home, our mission is to make the process quick, secure, and rewarding.
        Together, we bring peace of mind to your journey.
      </p>

      {/* Social Icons */}
      <div className="flex gap-6 text-2xl mt-4">
        {[
          { icon: "facebook", href: "https://facebook.com" },
          { icon: "instagram", href: "https://instagram.com" },
          { icon: "twitter", href: "https://twitter.com" },
          { icon: "linkedin", href: "https://linkedin.com" },
        ].map(({ icon, href }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-gray-400 transition-colors"
          >
            <i className={`fab fa-${icon}`}></i>
          </motion.a>
        ))}
      </div>
    </motion.footer>
  );
};

export default Footer;
