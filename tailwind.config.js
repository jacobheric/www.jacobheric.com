module.exports = {
  purge: {
    content: ["./src/**/*.html", "./src/**/*.md"],
    options: {
      safelist: ["my-6", "rounded-md", "max-h-screen", "max-w-screen"],
    },
  },
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        serif: ["Palatino Linotype", "Book Antiqua", "Palatino"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
