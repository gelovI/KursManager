/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        title1: ["ArchivoBlack"],
        title2: ["Satisfy"],
      },
      rotate: {
        clockwise: "15deg",
        counterClockwise: "-15deg",
      },
    },
  },
  plugins: [],
};
