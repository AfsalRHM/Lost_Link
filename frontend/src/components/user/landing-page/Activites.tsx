import { motion } from "framer-motion";

const activityData = [
  {
    title: "Put a Request",
    description:
      "Submit a request by providing details about your lost item, including where and when you lost it.",
    tooltip: "Submit your request",
    image: "/Activity-First-Logo.png",
    alt: "Put a Request",
  },
  {
    title: "Find the Thing",
    description: "Browse found items or get notified when there's a match.",
    tooltip: "Browse found items",
    image: "/Activity-Second-Logo.png",
    alt: "Find the Thing",
  },
  {
    title: "Get a Reward",
    description:
      "Retrieve your item, or if you found someone else's, claim your reward.",
    tooltip: "Claim your reward",
    image: "/Activity-Third-Logo.png",
    alt: "Get a Reward",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Activities = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
      className="w-full bg-activity px-5 md:px-10 py-12"
    >
      {/* Heading */}
      <motion.h2
        variants={item}
        className="text-center font-extrabold text-3xl md:text-5xl underline text-activityHeading mb-12"
      >
        What You Can Do
      </motion.h2>

      {/* Activities */}
      <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
        {activityData.map((activity, index) => (
          <motion.div
            key={index}
            variants={item}
            className="w-full md:w-1/4 text-center group cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="flex flex-col items-center gap-3 mb-4 relative">
              <img
                src={activity.image}
                alt={activity.alt}
                className="w-16 h-16 md:w-14 md:h-14 rounded-full transition-transform group-hover:scale-110 shadow-md"
              />
              <p className="font-semibold text-lg group-hover:text-blue-500 transition-colors duration-200">
                {activity.title}
              </p>

              {/* Tooltip */}
              <div className="absolute bottom-20 bg-black text-white text-xs md:text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-20">
                {activity.tooltip}
              </div>
            </div>
            <p className="font-medium text-sm md:text-base text-gray-700 px-2">
              {activity.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Activities;
