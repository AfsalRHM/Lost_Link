import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Emily S",
    image: "/Profile-1.png",
    message:
      "LostLink saved the day! I lost my bag during a hectic train ride, and within two days, someone found it and returned it through the app. The process was quick, secure, and I even got a notification when my item was matched. Highly recommended!",
  },
  {
    name: "James R",
    image: "/Profile-2.png",
    message:
      "I found a wallet on the bus and didn't know how to return it safely. LostLink made it super easy, and I even earned a small reward for doing the right thing. Great app with a great mission!",
  },
  {
    name: "Sophia L",
    image: "/Profile-3.png",
    message:
      "I left my designer handbag on a crowded subway and thought it was gone forever. LostLink found it within a week, making the whole process simple and secure. Truly grateful!",
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

const card = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Reviews = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
      className="w-full bg-banner py-16 flex flex-col items-center font-medium"
    >
      <motion.h2
        variants={card}
        className="text-3xl md:text-4xl font-semibold pb-10 text-center"
      >
        What People are Saying
      </motion.h2>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-10 lg:gap-20 justify-center items-center mx-4">
        {testimonials.map((review, index) => (
          <motion.div
            key={index}
            variants={card}
            className="w-full md:w-96 min-h-[300px] bg-reviews py-6 px-6 rounded-xl flex flex-col justify-between items-center shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <p className="text-center text-base md:text-lg leading-relaxed">
              {review.message}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <img
                src={review.image}
                alt={review.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              />
              <span className="font-semibold">{review.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Reviews;
