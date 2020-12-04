const elasticlunr = require("elasticlunr");

module.exports = function (collection) {
  var index = elasticlunr(function () {
    this.setRef("id");
    this.addField("title");
  });

  collection.forEach((page) => {
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
    });
  });

  return index.toJSON();
};
