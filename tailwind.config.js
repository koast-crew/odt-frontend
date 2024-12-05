/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fg: 'var(--foreground-color)',
        bg: 'var(--background-color)',
        dark: 'var(--text-color)',
        light: 'var(--gray1)',
        main: 'var(--main-color)',
        sub: 'var(--sub-color)',
        blue: 'var(--blue)',
        skyblue: 'var(--skyblue)',
        orange: 'var(--orange)',
        gray1: 'var(--gray1)',
        gray2: 'var(--gray2)',
        gray3: 'var(--gray3)',
        gray4: 'var(--gray4)',
        gray5: 'var(--gray5)',
        gray6: 'var(--gray6)',
        gray7: 'var(--gray7)',
        gray8: 'var(--gray8)',
        gray9: 'var(--gray9)',
        gray10: 'var(--gray10)',
      },
    },
  },
  plugins: [],
};

