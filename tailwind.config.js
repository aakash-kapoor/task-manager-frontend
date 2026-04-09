/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        trello: {
          blue: '#0079bf',
          dark: '#0067a3',
          bg: '#fafbfc',
        }
      }
    },
  },
  plugins: [],
}