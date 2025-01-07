/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      colors: {
        primary: '#9D7967',
        secondary: '#64748b'
      },
      animation: {
        slideIn: 'slideIn 1.5s ease-out forwards',
      },
      boxShadow: {
        'sides': '-4px 0 8px -2px rgba(0, 0, 0, 0.1), 4px 0 8px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

