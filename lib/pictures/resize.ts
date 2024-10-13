import {
  IMG_LARGE,
  IMG_SMALL,
  PICTURES,
  QUALITY,
  RAW_POST_PICS_DIR,
  setShardedName,
  ShardName,
  SHARDS,
} from "@/lib/pictures/picture.ts";
import { parseArgs } from "@std/cli";
import { join } from "@std/path";

import { PICTURES_INDEX } from "@/lib/db/db.ts";
import sharp from "npm:/sharp";

const postPics = () => Array.from(Deno.readDirSync(RAW_POST_PICS_DIR));

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

const resizeAll = async (overwrite: boolean = false) => {
  const pics = postPics();

  await Promise.all(pics.map(async (p: Deno.DirEntry) => {
    if (p.name.startsWith(".")) {
      return;
    }

    const name = p.name.toLowerCase();
    const existingShard = PICTURES[name];

    if (!overwrite && existingShard) {
      return;
    }

    const shard = overwrite && existingShard
      ? existingShard.shard
      : SHARDS[Math.floor(Math.random() * SHARDS.length)];

    console.log("resizing image", name);

    if (p.name.endsWith(".gif") || name.endsWith("png")) {
      await copy(join(RAW_POST_PICS_DIR, name), setShardedName(name, shard));
      PICTURES[name] = { shard };
      return;
    }

    const raw: Uint8Array = Deno.readFileSync(
      join(RAW_POST_PICS_DIR, p.name),
    );

    const sizes = await resizeRaw(raw, name, shard);
    PICTURES[name] = { shard, sizes };
  }));

  void writeIndex();
};

const writeIndex = () =>
  Deno.writeTextFileSync(
    PICTURES_INDEX,
    JSON.stringify(PICTURES),
  );

const flags = parseArgs(Deno.args, {
  boolean: ["overwrite"],
  default: { overwrite: false },
});

console.log("resizing pictures...");
await resizeAll(flags.overwrite);
console.log("done");
