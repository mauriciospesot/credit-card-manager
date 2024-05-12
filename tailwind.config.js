/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primery": "rgb(60 80 224 / var(--tw-bg-opacity))",
      },
    },
  },
  plugins: [],
};
