import {
  IMG_LARGE,
  IMG_SMALL,
  INDEX_FILE,
  type PictureType,
  QUALITY,
  RAW_POST_PICS_DIR,
  setShardedName,
  ShardName,
  SHARDS,
} from "@/lib/pictures/picture.ts";
import { parseArgs } from "@std/cli";
import { join } from "@std/path";

import { db } from "@/lib/db.ts";
import sharp from "npm:/sharp";

export const postPics = () => Array.from(Deno.readDirSync(RAW_POST_PICS_DIR));

const copy = async (src: string, dest: string) =>
  await Deno.copyFile(
    src,
    dest,
  );

const resize = async (
  img: sharp.Sharp,
  name: string,
  width?: number,
) =>
  width
    ? await img
      .resize({ width })
      .withMetadata()
      .toFormat("jpeg")
      .jpeg({ quality: QUALITY })
      .toFile(name)
    : await img
      .withMetadata()
      .toFormat("jpeg")
      .jpeg({ quality: QUALITY })
      .toFile(name);

const resizeRaw = async (
  raw: Uint8Array,
  name: string,
  shard: ShardName,
) => {
  const originalName = setShardedName(name, shard);
  const original = sharp(raw);
  const result = { large: false, small: false };
  const { width: w = 0 } = await original.metadata();

  if (w && w > IMG_LARGE) {
    const largeName = setShardedName(name, shard, "large");
    await resize(sharp(raw), largeName, IMG_LARGE);
    copy(largeName, originalName);
    result.large = true;
  }

  if (w && w > IMG_SMALL) {
    const smallName = setShardedName(name, shard, "small");
    await resize(sharp(raw), smallName, IMG_SMALL);
    !result.large && copy(smallName, originalName);
    result.small = true;
  }

  //
  // image was too small, just compress the original
  if (!result.large && !result.small) {
    await resize(original, originalName);
  }

  return result;
};

export const resizeAll = async (overwrite: boolean = false) => {
  const pics = postPics();

  await Promise.all(pics.map(async (p: Deno.DirEntry) => {
    if (p.name.startsWith(".")) {
      return;
    }

    const name = p.name.toLowerCase();
    const { value } = await db.get<PictureType>(["pictures", name]);
    const existingShard = value?.shard;

    if (!overwrite && existingShard) {
      return;
    }

    const shard = overwrite && existingShard
      ? existingShard
      : SHARDS[Math.floor(Math.random() * SHARDS.length)];

    console.log("resizing image", name);

    if (p.name.endsWith(".gif") || p.name.endsWith("png")) {
      await copy(join(RAW_POST_PICS_DIR, p.name), setShardedName(name, shard));
      db.set(["pictures", name], { shard });
      return;
    }

    const raw: Uint8Array = Deno.readFileSync(
      join(RAW_POST_PICS_DIR, p.name),
    );

    const sizes = await resizeRaw(raw, name, shard);
    db.set(["pictures", name], { shard, sizes });
  }));

  void writeIndex();
};

const writeIndex = async () => {
  const iter = db.list<PictureType>({ prefix: ["pictures"] }, { limit: 2000 });
  const pictures: { [key: string]: PictureType } = {};

  for await (const { key, value } of iter) {
    pictures[String(key.at(-1))] = value;
  }

  Deno.writeTextFileSync(
    INDEX_FILE,
    JSON.stringify(pictures),
  );
};

const flags = parseArgs(Deno.args, {
  boolean: ["overwrite"],
  default: { overwrite: false },
});

console.log("resizing pictures...");
await resizeAll(flags.overwrite);
console.log("done");
