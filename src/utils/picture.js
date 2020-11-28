const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const outdent = require("outdent");

const SIZES = [640, 1300, 1920];
const QUALITY = 85;

const getSrc = (name) => path.join(process.cwd(), "src/assets/image", name);

const getFile = (name) =>
  path.join(process.cwd(), "dist/assets/image/resized", name);

const getPath = (name) => path.posix.join("/", "assets/image/resized", name);

const saveOriginal = async (src) => {
  const i = getSrc(src);
  const o = `${getFile(`${path.parse(src).name}`)}.jpeg`;

  if (fs.existsSync(o)) {
    return;
  }

  const image = await sharp(i);

  await image
    .resize({ width: image.metadata().width })
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(o);
};

const saveJpeg = (src, name, width) => {
  const i = getSrc(src);
  const o = getFile(`${name}-${width}.jpeg`);

  if (fs.existsSync(o)) {
    return;
  }

  sharp(i)
    .resize({ width: width })
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(o);
};

const saveWebp = (src, name, width) => {
  const i = getSrc(src);
  const o = getFile(`${name}-${width}.webp`);

  if (fs.existsSync(o)) {
    return;
  }

  sharp(i)
    .resize({ width: width })
    .toFormat("webp")
    .webp({ quality: QUALITY })
    .toFile(o);
};

const createDir = () => {
  if (!fs.existsSync(path.join(process.cwd(), "dist/assets/image/resized"))) {
    fs.mkdirSync("dist/assets/image/resized", {
      recursive: true,
    });
  }
};

const resizeImage = (src) => {
  const source = getSrc(src);

  if (!fs.existsSync(source)) {
    throw new Error("Image specified in picture tag does not exist.");
  }

  createDir();
  saveOriginal(src);

  SIZES.forEach((width) => {
    saveJpeg(src, path.parse(src).name, width);
    saveWebp(src, path.parse(src).name, width);
  });
};

const getTags = (name, format) => {
  const paths = SIZES.map(
    (width) => `${getPath(`${name}-${width}.${format}`)} ${width}w`
  );

  return paths.join(",");
};

const passThrough = (src, alt) => {
  fs.copyFile(getSrc(src), getFile(name));
  return `<img src="${getPath(
    src
  )}" alt="${alt}" title="${alt}" loading="lazy">`;
};

module.exports = function (src, alt) {
  if (alt === undefined) {
    throw new Error("missing alt tag");
  }

  if (path.parse(src).ext === ".gif") {
    return passThrough(src, alt);
  }

  resizeImage(src);

  const webpTags = getTags(path.parse(src).name, "webp");
  const jpgTags = getTags(path.parse(src).name, "jpg");

  const picture = outdent`
    <picture>
      <source srcset="${webpTags}" sizes="90vw, (min-width: 1280px) 1152px" type="image/webp">
      <source srcset="${jpgTags}" sizes="90vw, (min-width: 1280px) 1152px" type="image/jpeg">
      <img class="my-6 rounded-md" src="${getPath(
        src
      )}" alt="${alt}" title="${alt}">
    </picture>
  `;

  return picture;
};
