import type { Config } from 'tailwindcss';

export default {
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
        'bz-electric': '#00A8EA',
        'bz-current': '#0077A3',
        'bz-glaze': '#E3F5FC',
        'bz-jet': '#1F2326',
        'bz-slate': '#5F6062',
        'bz-silver': '#C0C0C0',
        'bz-mist': '#F3F5F6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial', 'sans-serif'],
        body: ['var(--font-body)', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        sans: ['var(--font-body)', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
