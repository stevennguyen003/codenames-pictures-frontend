/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customRed: '#B22222',
        customBlue: '#4169E1',
        customButton: '#C7B299',
        customTitleRed: '#FF7F7F',
        customTitleBlue: '#ADD8E6',
      },
    },
  },
  plugins: [],
}

