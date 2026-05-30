import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d946ef", // O rosa/roxo do botão do seu layout Ventixe
        primaryHover: "#c026d3", // Uma variação um pouco mais escura para o hover
      },
    },
  },
  plugins: [],
};
export default config;