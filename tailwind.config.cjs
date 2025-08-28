/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Le dice a Tailwind que escanee todos tus componentes de React
  ],
  theme: {
    extend: {
      // Aquí puedes añadir tus colores neón personalizados para usarlos directamente en las clases
      // Ejemplo: className="text-neon-blue"
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#bf00ff',
        'neon-green': '#39ff14',
        'neon-gold': '#ffd700',
      }
    },
  },
  plugins: [],
}
