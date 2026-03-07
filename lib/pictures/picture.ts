import { pictureIndex } from "@/lib/db/db.ts";

import { join } from "@std/path";
import { PROD } from "../config.ts";

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

export const PICTURES: { [key: string]: PictureType } = pictureIndex();

const PASSTHROUGH_EXTENSIONS = new Set([".gif", ".png"]);
const RAW_IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

const getExtension = (name: string) => {
  const lower = name.toLowerCase();
  const index = lower.lastIndexOf(".");
  return index >= 0 ? lower.slice(index) : "";
};

const stripExtension = (name: string) => {
  const lower = name.toLowerCase();
  const index = lower.lastIndexOf(".");
  return index >= 0 ? lower.slice(0, index) : lower;
};

const addSizeSuffix = (name: string, size: SizeName) => {
  const index = name.lastIndexOf(".");
  return index >= 0
    ? `${name.slice(0, index)}-${size}${name.slice(index)}`
    : `${name}-${size}`;
};

const outputName = (name: string) => {
  const lower = name.toLowerCase();
  const extension = getExtension(lower);

  if (
    PASSTHROUGH_EXTENSIONS.has(extension) || extension === ".jpg" ||
    extension === ".jpeg"
  ) {
    return lower;
  }

  return `${stripExtension(lower)}.jpg`;
};

export const isSupportedRawImage = (name: string) =>
  RAW_IMAGE_EXTENSIONS.has(getExtension(name));

export const isPassthroughImage = (name: string) =>
  PASSTHROUGH_EXTENSIONS.has(getExtension(name));

export const isHeifImage = (name: string) => {
  const extension = getExtension(name);
  return extension === ".heif" || extension === ".heic";
};

export const setShardedName = (
  name: string,
  shard: ShardName,
  size?: SizeName,
) =>
  join(
    OUT_POST_PICS_DIR,
    shard,
    size ? addSizeSuffix(outputName(name), size) : outputName(name),
  );

const getPath = (src: string, size?: SizeName) => {
  const normalized = outputName(src);
  return size ? addSizeSuffix(normalized, size) : normalized;
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
