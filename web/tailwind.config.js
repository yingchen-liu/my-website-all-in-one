/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        calibre: ['Calibre', 'sans-serif'],
        sfmono: ['SFMono', 'monospace'],
      },
    },
  },
  plugins: [],
}

