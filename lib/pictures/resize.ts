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
import { join } from "https://deno.land/std@0.216.0/path/join.ts";
import sharp from "npm:/sharp";

const SHARDS: ShardName[] = ["birch", "maple", "pine", "oak"];
const QUALITY = 85;

const writeIndex = (index: Record<string, string>) =>
  Deno.writeTextFileSync(
    INDEX_FILE,
    JSON.stringify(index),
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
  const original = sharp(raw);
  await resize(original, setShardName(name, shard));

  const { width: w = 0 } = await original.metadata();

  if (w && w > IMG_LARGE) {
    await resize(sharp(raw), setShardName(name, shard, "large"), IMG_LARGE);
  }

  if (w && w > IMG_SMALL) {
    await resize(sharp(raw), setShardName(name, shard, "small"), IMG_SMALL);
  }

  return;
};

export const resizeAll = async () => {
  const pics = postPics();
  const index = readIndex();

  await Promise.all(pics.map(async (p: Deno.DirEntry) => {
    const shard = SHARDS[Math.floor(Math.random() * SHARDS.length)];
    const name = p.name.toLowerCase();

    if (index[name]) {
      return;
    }
    console.log("resizing image", name);

    if (p.name.endsWith(".gif")) {
      await Deno.copyFile(
        join(RAW_POST_PICS_DIR, p.name),
        setShardName(name, shard),
      );
      index[name] = shard;
      return;
    }

    const raw: Uint8Array = Deno.readFileSync(
      join(RAW_POST_PICS_DIR, p.name),
    );

    await resizeRaw(raw, name, shard);
    index[name] = shard;
  }));
  writeIndex(index);
};

console.log("resizing...");
await resizeAll();
console.log("done");
