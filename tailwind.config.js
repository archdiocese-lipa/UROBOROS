/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F6F0ED",
        accent: "#663F30",
        white: "#FFFFFF",
        blue: "#2394FE",
        "secondary-accent": "#F4E2D9",
        "primary-outline":"#E8DAD3"
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        heading: "26px",
      },
    },
  },
};
