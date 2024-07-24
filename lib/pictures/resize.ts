import {
  IMG_LARGE,
  IMG_SMALL,
  INDEX_FILE,
  postPics,
  RAW_POST_PICS_DIR,
  readIndex,
  setShardName,
  ShardName,
} from "@/lib/pictures/picture.ts";
import { join } from "@std/path";
import { parseArgs } from "@std/cli";

import sharp from "npm:/sharp";

const SHARDS: ShardName[] = ["birch", "maple", "pine", "oak"];
const QUALITY = 85;

const writeIndex = (index: Record<string, string>) =>
  Deno.writeTextFileSync(
    INDEX_FILE,
    JSON.stringify(index),
  );

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
  const originalName = setShardName(name, shard);
  const original = sharp(raw);
  const result = { large: false, small: false };
  const { width: w = 0 } = await original.metadata();

  if (w && w > IMG_LARGE) {
    const largeName = setShardName(name, shard, "large");
    await resize(sharp(raw), largeName, IMG_LARGE);
    copy(largeName, originalName);
    result.large = true;
  }

  if (w && w > IMG_SMALL) {
    const smallName = setShardName(name, shard, "small");
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
  const index = readIndex();

  await Promise.all(pics.map(async (p: Deno.DirEntry) => {
    const name = p.name.toLowerCase();
    const existing = index[name]?.shard;

    if (!overwrite && existing) {
      return;
    }

    const shard = overwrite && existing
      ? existing
      : SHARDS[Math.floor(Math.random() * SHARDS.length)];

    console.log("resizing image", name);

    if (p.name.endsWith(".gif") || p.name.endsWith("png")) {
      await copy(join(RAW_POST_PICS_DIR, p.name), setShardName(name, shard));
      index[name] = { shard };
      return;
    }

    const raw: Uint8Array = Deno.readFileSync(
      join(RAW_POST_PICS_DIR, p.name),
    );

    const sizes = await resizeRaw(raw, name, shard);
    index[name] = { shard, sizes };
  }));
  writeIndex(index);
};

const flags = parseArgs(Deno.args, {
  boolean: ["overwrite"],
  default: { overwrite: false },
});

console.log("resizing...");
await resizeAll(flags.overwrite);
console.log("done");
