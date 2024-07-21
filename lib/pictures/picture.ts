import { existsSync } from "@std/fs";
import { join } from "jsr:@std/path@0.213/join";

const PROD = Deno.env.get("PRODUCTION") === "true";

export type SizeName = "small" | "large";
export type ShardName = "birch" | "maple" | "oak" | "pine";

export const RAW_POST_PICS_DIR = "./static/image/raw";
export const OUT_POST_PICS_DIR = "./static/image/resized";
const ASSET_PATH = "/image/resized";

export const IMG_SMALL = 640;
export const IMG_LARGE = 1300;

export const INDEX_FILE = "./lib/pictures/pictures.json";

export const readIndex = () =>
  existsSync(INDEX_FILE) ? JSON.parse(Deno.readTextFileSync(INDEX_FILE)) : {};

export const SHARD_INDEX = readIndex();

export const postPics = () => Array.from(Deno.readDirSync(RAW_POST_PICS_DIR));

export const getShardIndex = (name: string) => {
  const shard = SHARD_INDEX[name.toLowerCase()];
  if (!shard) {
    throw new Error(`Image not found in shard index: ${name}`);
  }
  return shard;
};

export const setShardName = (
  name: string,
  shard: ShardName,
  size?: SizeName,
) =>
  join(
    OUT_POST_PICS_DIR,
    shard,
    size ? name.toLowerCase().replace(".jpg", `-${size}.jpg`) : name,
  );

export const getShardName = (
  name: string,
  size?: SizeName,
) =>
  join(
    OUT_POST_PICS_DIR,
    getShardIndex(name),
    size ? name.toLowerCase().replace(".jpg", `-${size}.jpg`) : name,
  );

export const getShardURL = (
  name: string,
  size?: SizeName,
) => {
  const shard = getShardIndex(name);
  const lower = name.toLowerCase();

  return PROD
    ? join(
      `https://${shard}.jacobheric.com`,
      size ? lower.replace(".jpg", `-${size}.jpg`) : lower,
    )
    : join(
      ASSET_PATH,
      shard,
      size ? lower.replace(".jpg", `-${size}.jpg`) : lower,
    );
};

export const getShardURLs = (name: string) => {
  const large = getShardURL(name, "large");
  const small = getShardURL(name, "small");
  return {
    original: getShardURL(name),
    ...existsSync(large) ? { large } : {},
    ...existsSync(small) ? { small } : {},
  };
};
