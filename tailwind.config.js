/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#F6F0ED",
		"accent": "#663F30",
		"white":"#FFFFFF",	
		"blue": "#2394FE",
		"secondary-accent":"#F4E2D9"
      },
	  fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },

    },
  },
};
