const markdownIt = require("markdown-it");
const pictureShortcode = require("./src/utils/picture");

module.exports = function (config) {
  config.addPassthroughCopy("src/assets/image/icons");
  config.addShortcode("picture", pictureShortcode);
  config.addFilter("md", function (content = "") {
    return markdownIt({ html: true }).render(content);
  });

  module.exports = function (eleventyConfig) {
    config.setDataDeepMerge(true);
  };

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!--more-->",
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
