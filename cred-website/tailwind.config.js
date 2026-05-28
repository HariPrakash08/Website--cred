/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#8C6E2A',
        },
        cred: {
          black: '#0A0A0A',
          surface: '#111111',
          elevated: '#181818',
          border: '#242424',
        },
        accent: '#2ECC8B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #8C6E2A)',
        'surface-gradient': 'linear-gradient(135deg, #111111, #181818)',
      },
    },
  },
  plugins: [],
}
