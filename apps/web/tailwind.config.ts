import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1A1C1E",
          blue: "#1B4F9E",
          green: "#1D7A3A",
          gold: "#C9A227",
          red: "#CC2B2B",
        },
        primary: {
          DEFAULT: "#1B4F9E",
          light: "#3A73CD",
          dark: "#1A1C1E",
        },
        accent: {
          teal: "#1D7A3A",
          amber: "#C9A227",
        },
        status: {
          success: "#1D7A3A",
          urgent: "#CC2B2B",
          pending: "#C9A227",
          expired: "#6C757D",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular"],
      },
      spacing: {
        "8px": "8px",
      },
    },
  },
  plugins: [],
};
export default config;
