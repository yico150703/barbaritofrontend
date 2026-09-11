/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        barbarian: {
          dark: '#063D2A',       // Verde oscuro principal
          deep: '#022A1E',       // Verde profundo
          bright: '#28D978',     // Verde brillante / acento
          cream: '#F3F1EA',      // Crema claro
          white: '#FFFFFF',      // Blanco
          black: '#0B0E0C',      // Negro verdoso
          muted: '#8B9D95',      // Texto secundario
          border: '#D8E2DC',     // Bordes suaves
          card: '#FFFFFF',       // Fondo de tarjetas
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Bebas Neue', 'Cinzel', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
