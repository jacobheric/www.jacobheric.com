import { pictureIndex } from "@/lib/db/db.ts";
import { signal } from "@preact/signals";

import { join } from "@std/path";
import { PROD } from "@/lib/utils.ts";

export interface PictureType {
  shard: ShardName;
  sizes?: {
    large: boolean;
    small: boolean;
  };
}

export const SHARDS: ShardName[] = ["birch", "maple", "pine", "oak"];
export const QUALITY = 85;

export const RAW_POST_PICS_DIR = "./static/image/raw";

export type SizeName = "small" | "large";
export type ShardName = "birch" | "maple" | "oak" | "pine";

export const OUT_POST_PICS_DIR = "./static/image/resized";
const ASSET_PATH = "/image/resized";

export const IMG_SMALL = 640;
export const IMG_LARGE = 1300;

export const PICTURES = signal<{ [key: string]: PictureType }>(
  pictureIndex(),
);

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
  shard: string,
  size?: "small" | "large",
) => {
  const path = getPath(src, size);

  return PROD
    ? new URL(path, `https://${shard}.jacobheric.com`).toString()
    : join(ASSET_PATH, shard, path);
};
