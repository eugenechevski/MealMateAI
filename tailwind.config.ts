import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        primary: ["var(--font-roboto-serif)"],
        secondary: ["var(--font-pacifico)"],
      },
      colors: {
        "primary-text": "#333333",
        "primary-box": "#F2F2F2",
        "primary-button": "#FF4136",
        "primary-button-text": "#FFFFFF",
        "secondary-button": "#FF851B",
        "background-accent": "#FFF8DC",
        "accent": "#2ECC40",
      },
    },
  },
  plugins: [],
};
export default config;
