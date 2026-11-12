// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#09090b',
          charcoal: '#18181b',
          neon: '#d9f99d',
          accent: '#a3e635',
          crimson: '#ef4444',
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-12px) rotateX(4deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
};
