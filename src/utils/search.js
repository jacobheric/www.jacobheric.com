const elasticlunr = require("elasticlunr");
const striptags = require("striptags");

module.exports = function (collection) {
  const index = elasticlunr(function () {
    this.setRef("id");
    this.addField("title");
    this.addField("content");
  });

  collection.forEach((page) => {
    const stripped = striptags(page.template.frontMatter.content);
    index.addDoc({
      id: page.url,
      title: page.data.title,
      content: stripped.length > 100 ? stripped.substring(0, 100) : stripped,
    });
  });

  return index.toJSON();
};
