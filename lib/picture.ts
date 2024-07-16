import { existsSync } from "@std/fs";

import sharp from "npm:/sharp";
import { join } from "jsr:@std/path@0.213/join";

const RAW_POST_PICS_DIR = "./static/image/posts/raw";
const OUT_POST_PICS_DIR = "./static/image/posts/";

const SMALL = 600;
const LARGE = 1300;
const QUALITY = 85;

export const postPics = () => Array.from(Deno.readDirSync(RAW_POST_PICS_DIR));

const original = (name: string) =>
  join(
    OUT_POST_PICS_DIR,
    name.replace(".jpg", `-original.jpg`),
  );
const large = (name: string) =>
  join(OUT_POST_PICS_DIR, name.replace(".jpg", `-large.jpg`));
const small = (name: string) =>
  join(OUT_POST_PICS_DIR, name.replace(".jpg", `-small.jpg`));

const resize = async (
  img: sharp.Sharp,
  name: string,
) => {
  console.log("resizing image", name);
  img
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(original(name));

  const w = (await img.metadata()).width;

  w && w > LARGE && img.resize({ width: LARGE })
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(large(name));

  w && w > SMALL && img.resize({ width: SMALL })
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(small(name));
};

export const resizeAll = async () => {
  const pics = postPics();

  await Promise.all(pics.map(async (p: Deno.DirEntry) => {
    if (p.name.endsWith(".gif")) {
      await Deno.copyFile(
        join(RAW_POST_PICS_DIR, p.name),
        join(OUT_POST_PICS_DIR, p.name),
      );
      return;
    }

    if (
      existsSync(original(p.name)) && existsSync(large(p.name)) &&
      existsSync(small(p.name))
    ) {
      console.log("shit returning file already exists");
      return;
    }

    const raw: Uint8Array = await Deno.readFile(
      join(RAW_POST_PICS_DIR, p.name),
    );

    const img = sharp(raw);
    void resize(img, p.name);
  }));
};

console.log("resizing...");
await resizeAll();
console.log("done");
