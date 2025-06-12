import { motion } from "framer-motion";

const Main = ({ scrollToContact }: { scrollToContact?: any }) => {
  return (
    <div className="w-full bg-banner flex flex-col md:flex-row items-center md:items-start">
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-2/3 px-6 md:px-32 py-10 lg:py-24"
      >
        <div className="font-extrabold text-[30px] md:text-[45px] leading-tight text-shadow-sm mb-6 md:mb-10">
          What’s lost can be found.
          <br />
          <span className="text-[30px] md:text-[45px] font-semibold md:font-bold text-shadow-md">
            Together, we make it <br /> Happen.
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-medium text-lg md:text-xl mb-8 md:mb-16 text-shadow-lg text-gray-700"
        >
          LostLink connects lost items with their owners, making it easy to
          report, find, and earn rewards. Your lost belongings are just a step
          away from being found.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button
            className="px-8 py-3 rounded-full bg-blue-400 shadow-xl hover:bg-blue-500 transition-all duration-300 font-semibold text-lg"
            onClick={scrollToContact}
          >
            Talk to Us
          </button>
        </motion.div>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex items-center justify-center md:pl-8 py-10 md:py-24"
      >
        <img
          className="w-auto h-[450px] object-contain drop-shadow-lg"
          src="/Banner-Image.png"
          alt="Banner Illustration"
        />
      </motion.div>
    </div>
  );
};

export default Main;
