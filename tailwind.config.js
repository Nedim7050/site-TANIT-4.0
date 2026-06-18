/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#060b18', ink: '#101526', gold: '#d8af55', parchment: '#ead8aa', burgundy: '#651f34'
      },
      fontFamily: { display: ['Cinzel', 'serif'], body: ['DM Sans', 'sans-serif'], letter: ['IM Fell English', 'serif'] },
      boxShadow: { glow: '0 0 35px rgba(216,175,85,.22)' }
    }
  },
  plugins: []
}
