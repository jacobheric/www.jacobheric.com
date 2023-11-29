const markdownIt = require("markdown-it");
const htmlmin = require("html-minifier");
const pictureShortcode = require("./src/utils/picture");
const searchFilter = require("./src/utils/search");
const util = require("util");

module.exports = function (config) {
  if (process.env.NODE_ENV === "production") {
    config.addTransform("htmlmin", minifyHTML);
  }

  config.addPassthroughCopy("src/assets/image/icons");
  config.addPassthroughCopy("src/assets/style/style.css");
  config.addPassthroughCopy("src/assets/fonts");

  config.addShortcode("picture", pictureShortcode);

  config.addFilter("dump", (obj) => {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    return JSON.stringify(obj, getCircularReplacer(), 4);
  });

  config.addFilter("search", searchFilter);
  config.addFilter("md", function (content = "") {
    return markdownIt({ html: true }).render(content);
  });

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!--more-->",
  });

  function minifyHTML(content, outputPath) {
    return outputPath.endsWith(".html")
      ? htmlmin.minify(content, {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          sortAttributes: true,
          sortClassName: true,
          useShortDoctype: true,
        })
      : content;
  }

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
