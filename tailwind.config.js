/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pink: {
          light: '#f3a6a6',
          dark: '#e58b8b',
          active: '#d66e6e'
        }
      }
    },
  },
  plugins: [],
}
