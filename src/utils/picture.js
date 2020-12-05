const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const outdent = require("outdent");

const SIZES = [1300, 640];
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

const imageName = (name, width, ext) => `${name}-${width}.${ext}`;

const getTags = (src) => {
  const name = path.parse(src).name;

  const paths = SIZES.map((width) => {
    const jpg = imageName(name, width, "jpg");
    const webp = imageName(name, width, "webp");
    let sourceTags = [];

    if (exists(getFile(jpg))) {
      sourceTags.push(
        `<source srcset="${getPath(jpg)} ${width}w" sizes="(min-width: ${
          width - 50
        }px) ${width}px" type="image/jpeg">`
      );
    }

    if (exists(getFile(webp))) {
      sourceTags.push(
        `<source srcset="${webp} ${width}w" sizes="(min-width: ${
          width - 50
        }px) ${width}px" type="image/webp">`
      );
    }

    return sourceTags.join(" ");
  }).filter((tag) => tag);

  return paths.join(" ");
};

const passThrough = (src, alt) => {
  fs.copyFileSync(getSrc(src), getFile(src));
  return `<img src="${getPath(src)}" alt="${alt}" title="${alt}">`;
};

module.exports = async function (src, alt) {
  if (alt === undefined) {
    throw new Error(`missing alt tag for src: ${src}`);
  }

  if (path.parse(src).ext === ".gif") {
    console.log(`copying raw gif to dist: ${src}`);
    return passThrough(src, alt);
  }

  const done = await resizeImage(src);

  const picture = outdent`
    <picture>
      ${getTags(src)}
      <img class="my-6 rounded-md max-h-screen max-w-screen" src="${getPath(
        `${path.parse(src).name}.jpg`
      )}" alt="${alt}" title="${alt}" loading="lazy">
    </picture>
  `;

  return picture;
};
