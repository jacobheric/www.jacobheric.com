const markdownIt = require("markdown-it");
const pictureShortcode = require("./src/utils/picture");
const searchFilter = require("./src/utils/search");

module.exports = function (config) {
  config.addPassthroughCopy("src/assets/image/icons");
  config.addPassthroughCopy("src/assets/style/style.css");
  config.addShortcode("picture", pictureShortcode);
  config.addFilter("md", function (content = "") {
    return markdownIt({ html: true }).render(content);
  });

  config.setDataDeepMerge(true);
  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!--more-->",
  });

  config.addFilter("search", searchFilter);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
