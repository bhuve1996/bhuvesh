/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'orbit-pulse': 'orbit-pulse 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'data-flow': 'data-flow 2s linear infinite',
        'loading-progress': 'loading-progress 3s ease-in-out infinite',
        'loading-dots': 'loading-dots 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
