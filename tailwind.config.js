export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0056b3",
        secondary: "#17a2b8",
        accent: "#28a745",
        success: "#28a745",
        warning: "#ffc107",
        error: "#dc3545",
        info: "#17a2b8",
        surface: "#ffffff",
        background: "#f8f9fa"
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}