const elasticlunr = require("elasticlunr");
const striptags = require("striptags");

module.exports = function (collection) {
  var index = elasticlunr(function () {
    this.setRef("id");
    this.addField("title");
    this.addField("content");
  });

  collection.forEach((page) => {
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
      content: striptags(page.templateContent),
    });
  });

  return index.toJSON();
};
