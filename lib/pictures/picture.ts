import { db } from "@/lib/db.ts";

import { join } from "@std/path";

export interface PictureType {
  shard: ShardName;
  sizes: {
    large: boolean;
    small: boolean;
  };
}

export const PROD = Deno.env.get("PRODUCTION") === "true";

export const INDEX_FILE = "./lib/pictures/pictures.json";
export const SHARDS: ShardName[] = ["birch", "maple", "pine", "oak"];
export const QUALITY = 85;

export const RAW_POST_PICS_DIR = "./static/image/raw";

export type SizeName = "small" | "large";
export type ShardName = "birch" | "maple" | "oak" | "pine";

export const OUT_POST_PICS_DIR = "./static/image/resized";
const ASSET_PATH = "/image/resized";

export const IMG_SMALL = 640;
export const IMG_LARGE = 1300;

export const getShardIndex = async (name: string) => {
  const { value } = await db.get<PictureType>(["pictures", name]);

  if (!value) {
    throw new Error(`Image not found in shard kv: ${name}`);
  }
  return value;
};

export const setShardedName = (
  name: string,
  shard: ShardName,
  size?: SizeName,
) =>
  join(
    OUT_POST_PICS_DIR,
    shard,
    size ? name.toLowerCase().replace(".jpg", `-${size}.jpg`) : name,
  );

const getPath = (src: string, size?: SizeName) => {
  const lower = src.toLowerCase();
  return size ? lower.replace(".jpg", `-${size}.jpg`) : lower;
};

export const getImageUrl = (
  src: string,
  { shard, sizes }: PictureType,
  requestedSize?: SizeName,
) => {
  //
  // resizer doesn't upsize and there are lots of old/small
  // images...so we need to check it small and large versions exist
  const size = !requestedSize || src.endsWith(".jpg")
    ? undefined
    : requestedSize === "large" && sizes.large
    ? "large"
    : requestedSize === "small" && sizes.small
    ? "small"
    : undefined;

  const path = getPath(src, size);

  return PROD
    ? new URL(path, `https://${shard}.jacobheric.com`).toString()
    : join(ASSET_PATH, shard, path);
};
