import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        primary: '#00FF41',
        'text-primary': '#FFFFFF',
        'text-secondary': '#999999',
        'text-highlight': '#00FF41',
        'text-light': '#000000',
        'text-dark': '#FFFFFF',
        border: {
          default: '#E0E0E0',
          active: '#00FF41',
        },
        button: {
          buy: '#00FF41',
          default: '#222222',
        },
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
