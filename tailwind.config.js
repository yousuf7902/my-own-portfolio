/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/*.{html,js}'],
  theme: {
    extend: {
      screens:{
        sm:'480px',
        md:'768px',
        lg:'976px',
        xl:'1330px',
      },
      colors:{
        bg_primary: '#1E1E1E',
        primary: '#FD6F00'
      },
      fontFamily:{
        urbanist:['Urbanist']
      }
    },
  },
  plugins: [],
}

