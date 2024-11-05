/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '375px',
      md: '580px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        text: 'var(--text)',
        error: 'var(--error)',
        'highlight-100': 'var(--highlight-100)',
      },
    },
  },
  future: {},
  plugins: [],
};
