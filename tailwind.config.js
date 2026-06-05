/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aphrc: {
          green: '#7BC148',
          light: '#B9D989',
          dark: '#020101',
        },
        risk: {
          high: '#DC2626',
          medium: '#D97706',
          low: '#2563EB',
        },
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}