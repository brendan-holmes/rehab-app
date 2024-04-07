/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // combination of raidal-gradient and background size gives us a grid of dots
      
      // not working/tested
      backgroundImage: {
        'dot-grid': 'radial-gradient(grey 1px, transparent 0)'
      },
      backgroundSize: {
        '40': '40px 40px'
      },
    },
  },
  plugins: [],
}

