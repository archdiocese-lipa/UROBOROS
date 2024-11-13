/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		animation: {
  			textMove: 'textMove 2s infinite alternate'
  		},
  		keyframes: {
  			textMove: {
  				'0%': {
  					color: '#ff7f50',
  					transform: 'translate(0, 0)'
  				},
  				'100%': {
  					color: '#1e90ff',
  					transform: 'translate(30px, 30px)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	} // remove this after removing the title in app js
  },
  plugins: [require("tailwindcss-animate")],
}

