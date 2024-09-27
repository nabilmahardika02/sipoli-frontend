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
        primary: {
          1: "#721E49",
          2: "#913275",
          3: "#CE5888",
          4: "#D879A0",
          5: "#EBBCCF",
          6: "#F5DEE7",
        },
        secondary: {
          1: "#1D1F2E",
          2: "#2A2C41",
          3: "#6A6C7A",
          4: "#94959F",
          5: "#C0C0C6",
          6: "#EAEAEC",
        },
        danger: {
          1: "#651D18",
          2: "#A22E27",
          3: "#F0C4C2",
          4: "#FFF1F0",
          core: "#CB3A31",
        },
        warning: {
          1: "#7F5920",
          2: "#CC8E33",
          3: "#FFE8C6",
          4: "#FFF8EC",
          core: "#FFB240",
        },
        success: {
          1: "#004931",
          2: "#00754E",
          3: "#B3DFD0",
          4: "#F1FBF8",
          core: "#009262",
        },
        ternary: "#8697C3",
        tertiary: "#ADBADA",
        themeDark: "#475FB8",
        bluemilk: "#EEE8F6",
        eerie: "#1E1E1E",
        licorice: "#200B0B",
        dark: "#1A0909",
        netral: {
          6: "#FFFFFF",
          5: "#F5F7FA",
          4: "#E6E6E6",
          3: "#B9B9B9",
          2: "#848484",
          1: "#2C2C2C"
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
