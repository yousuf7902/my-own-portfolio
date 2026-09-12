import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1330px",
      },
      colors: {
        bg_primary: "#1E1E1E",
        primary: "#FD6F00",
      },
      fontFamily: {
        urbanist: ["Urbanist", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
