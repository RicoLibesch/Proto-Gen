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
        primary: "#1D1B20",
        neutral: "#49454F",
        secondary: "#79747E",
        secondary_hover: "#EFEFEF",
        outline: "#CAC4D0",
        mni: "#2E5A66",
        mni_hover: "#397180",
        seperation: "#E9E9E9",
      },
    },
  },
  plugins: [],
};
export default config;
