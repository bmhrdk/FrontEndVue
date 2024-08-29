/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'josefin': ['Josefin Sans', 'sans-serif']
    },
    extend: {
      transitionProperty:{
        'opacity': 'opacity',
      },
      colors: {
        greenlight: "#47A000",
        graysecondary: "#F2F2F2",
        graydark: "#ADA7A7",
        chipdark: "#D9D9D9",
        lightdark: "#EEEEEE",
        orangeprimary: "#FFB550",
        orangered: "#FF5733",
        orangetip: "#FF4500",
        orangesecondtip: "#FF7F00",
        orangedeep: "#FF7F00",
        orangeclass: "#D17E00",
        redclass: "#FF0000",
        greenprimary: "#47A000",
        greenstatus: "#00CC08",
        smoothgray: "#131313",
        lightyellow: "#FCD019",
        bluestatus: "#3498DB",
        blueclass: "#007FFF",
        blurwhite: "#F9F9F9",
        blueprimary: "#007FFF",
        bluenote: "#4092C7",
        purpleprimary: "#8B008B",
      }
    },
  },
  variants:{
    extend:{
      opacity: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [],
}

