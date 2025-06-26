/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // vibrant blue
        accent: '#FBBF24',     // gold
        secondaryBg: '#F9FAFB', // light background
        darkBg: '#0F172A',     // navy
        soft: '#F8F9FB',       // light background for warmth and contrast
        light: '#F8F9FB',      // Updated Light background
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Unified font family
      },
      fontSize : {
        "course-deatails-heading-small" : ['26px','36px'],
        "course-deatails-heading-large" : ['36px','44px'],
        "home-heading-small" : ['28px','34px'],
        "home-heading-large" : ['28px','56px'],
        "default" : ['15px','21px'],
      },
      gridTemplateColumns:{
       'auto' : 'repeat(auto-fit , minmax(200px , 1fr))'
      }
    },
 },
  plugins: [],
}

