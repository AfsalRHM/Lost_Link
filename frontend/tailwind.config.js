/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        header: "#9CBBF7",
        banner: "#b6cefc",
        activity: "#a5c3ff",
        activityHeading: "#3c4581",
        reviews: "#dadada",
        contact: "#6498ff",
        footer: "#200063",
      },
      textShadow: {
        sm: "1px 1px 1px rgba(0, 0, 0, 0.3)",
        lg: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        xl: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      },
    },
    fontFamily: {
      display: ["Poppins", "sans-serif"],
      body: ["Inter", "sans-serif"],
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
