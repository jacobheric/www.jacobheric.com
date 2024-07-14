import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      "sans": ["Helvetica", "sans-serif"],
      "serif": ["Times", "serif"],
    },
  },
} satisfies Config;
