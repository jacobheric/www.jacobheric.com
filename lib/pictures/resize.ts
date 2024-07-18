import { existsSync } from "@std/fs";

import sharp from "npm:/sharp";
import { join } from "https://deno.land/std@0.216.0/path/join.ts";
import {
  IMG_LARGE,
  IMG_SMALL,
  largeName,
  originalName,
  OUT_POST_PICS_DIR,
  postPics,
  RAW_POST_PICS_DIR,
  smallName,
} from "@/lib/pictures/picture.ts";

const QUALITY = 85;

const resize = async (
  img: sharp.Sharp,
  name: string,
) => {
  console.log("resizing image", name);
  img
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(originalName(name));

  const w = (await img.metadata()).width;

  w && w > IMG_LARGE && img.resize({ width: IMG_LARGE })
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(largeName(name));

  w && w > IMG_SMALL && img.resize({ width: IMG_SMALL })
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: QUALITY })
    .toFile(smallName(name));
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
      existsSync(originalName(p.name)) && existsSync(largeName(p.name)) &&
      existsSync(smallName(p.name))
    ) {
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
