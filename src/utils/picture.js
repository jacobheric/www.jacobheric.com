const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const outdent = require("outdent");

const SIZES = [640, 1300, 1920];
const QUALITY = 85;

const getSrc = (name) => path.join(process.cwd(), "src/assets/image", name);
const getFile = (name) => path.join(process.cwd(), "dist/assets/image", name);
const getPath = (name) => path.posix.join("/", "assets/image", name);
const exists = (file) => fs.existsSync(file);
const getImage = async (src) => sharp(getSrc(src));

const saveOriginal = (image, out) => {
  image
    .resize({ width: image.metadata().width })
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(out);
};

const saveJpg = async (image, name, width) => {
  const o = getFile(`${name}-${width}.jpg`);

  if (fs.existsSync(o)) {
    return;
  }

  return image
    .resize({ width: width })
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(o);
};

const saveWebp = async (image, name, width) => {
  const o = getFile(`${name}-${width}.webp`);

  if (fs.existsSync(o)) {
    return;
  }

  return image
    .resize({ width: width })
    .toFormat("webp")
    .webp({ quality: QUALITY })
    .toFile(o);
};

const createDir = () => {
  if (!fs.existsSync(path.join(process.cwd(), "dist/assets/image"))) {
    fs.mkdirSync("dist/assets/image", {
      recursive: true,
    });
  }
};

const resizeImage = async (src) => {
  console.log(`resizing image: ${src}`);

  const source = getSrc(src);

  if (!fs.existsSync(source)) {
    throw new Error(`source image doesn't exists ${src}`);
  }

  //
  // if the original is already in dest, that means we've already processed it
  // this assumption keeps build times fast because we're only loading files the first time
  const out = `${getFile(`${path.parse(src).name}`)}.jpg`;
  if (exists(out)) {
    console.log(`skipping resize, src image already in dist: ${src}`);
    return true;
  }

  createDir();

  const image = await getImage(src);
  saveOriginal(image, out);
  const meta = await image.metadata();

  for await (const width of SIZES) {
    //
    // don't upsize
    if (meta.width >= width - 50) {
      console.log(`resizing ${src} to ${width}`);
      await saveJpg(image, path.parse(src).name, width);
      await saveWebp(image, path.parse(src).name, width);
    }
  }

  console.log(`src image resized: ${src}`);
  return true;
};

const getTags = (src, format) => {
  name = path.parse(src).name;
  const paths = SIZES.map((width) => {
    if (exists(getFile(`${name}-${width}.${format}`))) {
      return `${getPath(`${name}-${width}.${format}`)} ${width}w`;
    }
  }).filter((tag) => tag);

  return paths.join(",");
};

const getWebpTag = (webpTags) =>
  webpTags.length > 0
    ? `<source srcset="${webpTags}" sizes="90vw, (min-width: 1280px) 1152px" type="image/webp">`
    : "";

const getJpgTag = (jpgTags) =>
  jpgTags.length > 0
    ? `<source srcset="${jpgTags}" sizes="90vw, (min-width: 1280px) 1152px" type="image/jpeg">`
    : "";

const passThrough = (src, alt) => {
  fs.copyFileSync(getSrc(src), getFile(src));
  return `<img src="${getPath(src)}" alt="${alt}" title="${alt}">`;
};

module.exports = async function (src, alt) {
  return "";

  if (alt === undefined) {
    throw new Error(`missing alt tag for src: ${src}`);
  }

  if (path.parse(src).ext === ".gif") {
    console.log(`copying raw gif to dist: ${src}`);
    return passThrough(src, alt);
  }

  const done = await resizeImage(src);

  const webpTags = done ? getTags(src, "webp") : "";
  const jpgTags = done ? getTags(src, "jpg") : "";

  const picture = outdent`
    <picture>
      ${getWebpTag(webpTags)}
      ${getJpgTag(jpgTags)}
      <img class="my-6 rounded-md max-h-screen max-w-screen" src="${getPath(
        `${path.parse(src).name}.jpg`
      )}" alt="${alt}" title="${alt}">
    </picture>
  `;

  return picture;
};
