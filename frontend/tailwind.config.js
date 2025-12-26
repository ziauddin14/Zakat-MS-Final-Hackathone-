/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#047857", // Emerald Green
          dark: "#065F46",
          light: "#10B981",
        },
        accent: {
          DEFAULT: "#D4AF37", // Soft Gold
          light: "#FCD34D",
          hover: "#B5952F",
        },
        background: "#F8FAFC", // Very light cool gray/white
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
