/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aquí definiremos los colores estilo "Cartoon" más adelante
      colors: {
        'brand-blue': '#3B82F6',
        'brand-yellow': '#FBBF24',
        'brand-purple': '#8B5CF6',
      }
    },
  },
  plugins: [],
}