const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    "./index.html"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      'sans': ['THICCCBOI'],
    },
    extend: {
      colors: {
        primary: colors.indigo
      },
      height: {
        '50vh': '50vh',
        'olg': '900px'
      },
      margin: {
        'o': '0 -20%'
      },
      width: {
        'o': '140%'
      },
      fontSize: {
        '10xl': '11rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [ require('@tailwindcss/aspect-ratio'), require('@tailwindcss/line-clamp')],
}
