import { motion } from "framer-motion";

const Main = () => {
  return (
    <div className="bg-banner text-black min-h-screen px-6 md:px-20 py-16 flex flex-col gap-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          About LostLink
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          A platform that brings people and their belongings back together.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-header p-6 md:p-10 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-activityHeading">
          Our Mission
        </h2>
        <p className="text-base md:text-lg leading-relaxed text-gray-800">
          LostLink is committed to simplifying the process of finding and
          returning lost items. Whether you're searching for something important
          or helping others, we provide a secure, efficient, and rewarding
          platform that fosters trust and community collaboration.
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: "/Activity-First-Logo.png",
            title: "Raise a Request",
            desc: "Report your lost item quickly with detailed info to get notified when a match is found.",
          },
          {
            icon: "/Activity-Second-Logo.png",
            title: "Discover Matches",
            desc: "Scroll through found items or get alerts when someone finds what you've lost.",
          },
          {
            icon: "/Activity-Third-Logo.png",
            title: "Earn Rewards",
            desc: "Found something? Help others and get recognized with points or rewards.",
          },
        ].map(({ icon, title, desc }, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-header p-6 rounded-xl shadow-md text-center flex flex-col items-center"
          >
            <img
              src={icon}
              alt={title}
              className="w-16 h-16 mb-4 rounded-full"
            />
            <h3 className="text-xl font-semibold mb-2 text-activityHeading">
              {title}
            </h3>
            <p className="text-gray-900 text-base">{desc}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
};

export default Main;
