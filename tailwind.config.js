/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors:{
      baseColor : "#292428",
      whiteColor : "#ffffff",
      lightGray  : "#f5f5f7",
      brown : "#705C53"

    }
  },
  plugins: [],
}

