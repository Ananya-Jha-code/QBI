/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#06090c',
        text: '#e7f0ee',
        'text-muted': '#a9bdb5',
        'text-subtle': '#6f857d',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-light': 'rgba(255, 255, 255, 0.14)',
        accent: '#4ad6b0',
        'accent-hover': 'rgba(74, 214, 176, 0.1)',
        blue: '#8fb6ff',
        gold: '#e0a458',
      },
      fontFamily: {
        serif: ['Newsreader', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['Manrope', 'sans-serif'],
      },
      backdropFilter: {
        blur: 'blur(14px)',
      },
    },
  },
  plugins: [],
}
