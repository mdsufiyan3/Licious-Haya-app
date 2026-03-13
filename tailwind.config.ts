import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './App.tsx',
    './**/*.{ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
