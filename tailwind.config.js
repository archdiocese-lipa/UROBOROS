/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F6F0ED",
        "primary-text": "#663E2F",
        accent: "#663F30",
        white: "#FFFFFF",
        blue: "#2394FE",
        "secondary-accent": "#F4E2D9",
        "primary-outline": "#E8DAD3",
        gray: "#E9E9E9",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "2xs": "10px",
        heading: "26px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
