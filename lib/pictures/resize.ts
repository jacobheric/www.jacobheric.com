import {
  IMG_LARGE,
  IMG_SMALL,
  isHeifImage,
  isPassthroughImage,
  isSupportedRawImage,
  PICTURES,
  QUALITY,
  RAW_POST_PICS_DIR,
  setShardedName,
  ShardName,
  SHARDS,
} from "@/lib/pictures/picture.ts";

import { join } from "@std/path";

import { PICTURES_INDEX } from "@/lib/db/db.ts";
import sharp from "npm:sharp@^0.34.5";

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
    await copy(largeName, originalName);
    result.large = true;
  }

  if (w && w > IMG_SMALL) {
    const smallName = setShardedName(name, shard, "small");
    await resize(sharp(raw), smallName, IMG_SMALL);
    if (!result.large) {
      await copy(smallName, originalName);
    }
    result.small = true;
  }

  //
  // image was too small, just compress the original
  if (!result.large && !result.small) {
    await resize(original, originalName);
  }

  return result;
};

const readConvertedHeif = async (path: string) => {
  const temp = await Deno.makeTempFile({ suffix: ".jpg" });
  try {
    const { code, stderr } = await new Deno.Command("sips", {
      args: ["-s", "format", "jpeg", path, "--out", temp],
      stdout: "null",
      stderr: "piped",
    }).output();

    if (code !== 0) {
      const message = new TextDecoder().decode(stderr).trim();
      throw new Error(message || "failed to convert HEIF image");
    }

    return await Deno.readFile(temp);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(
        "HEIF conversion requires macOS `sips` when sharp cannot decode HEIF",
      );
    }

    throw error;
  } finally {
    await Deno.remove(temp).catch(() => undefined);
  }
};

export type ResizeSummary = {
  processed: number;
  skipped: number;
  copiedOnly: number;
  resized: number;
};

export const resizePictures = async (
  overwrite: boolean = false,
): Promise<ResizeSummary> => {
  const pics = postPics();
  let changed = false;
  const summary: ResizeSummary = {
    processed: 0,
    skipped: 0,
    copiedOnly: 0,
    resized: 0,
  };

  for (const p of pics) {
    if (p.name.startsWith(".")) {
      summary.skipped++;
      continue;
    }

    if (!isSupportedRawImage(p.name)) {
      summary.skipped++;
      continue;
    }

    const name = p.name.toLowerCase();
    const existingShard = PICTURES[name];

    if (!overwrite && existingShard) {
      summary.skipped++;
      continue;
    }

    const shard = existingShard
      ? existingShard.shard
      : SHARDS[Math.floor(Math.random() * SHARDS.length)];

    console.log("resizing image", name);

    if (isPassthroughImage(name)) {
      await copy(join(RAW_POST_PICS_DIR, p.name), setShardedName(name, shard));
      PICTURES[name] = { shard };
      changed = true;
      summary.processed++;
      summary.copiedOnly++;
      continue;
    }

    const sourcePath = join(RAW_POST_PICS_DIR, p.name);
    const raw = await Deno.readFile(sourcePath);

    let sizes;
    try {
      sizes = await resizeRaw(raw, name, shard);
    } catch (error) {
      if (!isHeifImage(name)) {
        throw error;
      }

      const converted = await readConvertedHeif(sourcePath);
      sizes = await resizeRaw(converted, name, shard);
    }

    PICTURES[name] = { shard, sizes };
    changed = true;
    summary.processed++;
    summary.resized++;
  }

  if (changed) {
    void writeIndex();
  }
  return summary;
};

const writeIndex = () =>
  Deno.writeTextFileSync(
    PICTURES_INDEX,
    JSON.stringify(PICTURES),
  );
