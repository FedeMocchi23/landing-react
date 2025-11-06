/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        owner: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          foreground: 'hsl(0, 0%, 100%)',
          hover: 'hsl(142, 76%, 30%)',
        },
        tenant: {
          DEFAULT: 'hsl(24, 95%, 53%)',
          foreground: 'hsl(0, 0%, 100%)',
          hover: 'hsl(24, 95%, 45%)',
        },
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(240, 10%, 3.9%)',
        },
        muted: {
          DEFAULT: 'hsl(240, 4.8%, 95.9%)',
          foreground: 'hsl(240, 3.8%, 46.1%)',
        },
      },
    },
  },
  plugins: [],
}
