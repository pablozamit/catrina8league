/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Le dice a Tailwind que escanee todos tus componentes de React
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': {
            textShadow:
              '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff',
          },
          '50%': {
            textShadow:
              '0 0 20px #00f3ff, 0 0 30px #00f3ff, 0 0 40px #00f3ff',
          },
        },
        'glow-orange': {
          '0%, 100%': {
            textShadow:
              '0 0 10px #ff9800, 0 0 20px #ff9800, 0 0 30px #ff9800',
          },
          '50%': {
            textShadow:
              '0 0 20px #ff9800, 0 0 30px #ff9800, 0 0 40px #ff9800',
          },
        },
      },
      animation: {
        glow: 'glow 4s ease-in-out infinite',
        'glow-orange': 'glow-orange 4s ease-in-out infinite',
      },
      // Aquí puedes añadir tus colores neón personalizados para usarlos directamente en las clases
      // Ejemplo: className="text-neon-blue"
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#bf00ff',
        'neon-green': '#39ff14',
        'neon-gold': '#ffd700',
      },
    },
  },
  plugins: [],
}
