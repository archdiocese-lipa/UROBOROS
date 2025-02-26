/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        expand: {
          from: { height: "0px", opacity: 0 },
          to: { height: "var(--radix-collapsible-content-height)", opacity: 1 },
        },
        collapse: {
          from: { height: "var(--radix-collapsible-content-height)", opacity: 1 },
          to: { height: "0px", opacity: 0 },
        },
      },
      animation: {
        expand: "expand 0.3s ease-in-out",
        collapse: "collapse 0.3s ease-in-out",
      },
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
