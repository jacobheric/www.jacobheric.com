module.exports = {
  important: true,
  content: ["./src/**/*.html", "./src/**/*.md"],
  safelist: ["my-6", "rounded-md", "max-h-screen", "max-w-screen"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Palatino Linotype", "Book Antiqua", "Palatino"],
      },
    },
  },
  plugins: [],
};
