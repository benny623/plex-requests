import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    keyframes: {
      appear: {
        "0%": {
          opacity: "0",
        },
        "100%": {
          opacity: "1",
        },
      },
    },
    animation: {
      appear: "appear 1s ease-in-out",
      altappear: "appear .2s ease-in-out",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "dark"],
    darkTheme: "dark",
  },
} satisfies Config;
