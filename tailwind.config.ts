import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components,posts}/**/*.{ts,tsx,md,html}",
  ],
  theme: {
    fontFamily: {
      "sans": ["Helvetica", "sans-serif"],
      "serif": ["Times", "serif"],
    },
  },
} satisfies Config;
