import { join } from "jsr:@std/path@0.213/join";

export const RAW_POST_PICS_DIR = "./static/image/posts/raw";
export const OUT_POST_PICS_DIR = "./static/image/posts/out";

export const IMG_SMALL = 640;
export const IMG_LARGE = 1300;

export const postPics = () => Array.from(Deno.readDirSync(RAW_POST_PICS_DIR));

export const originalName = (name: string, dir?: string) =>
  fullName(name.replace(".jpg", `-original.jpg`), dir);

export const largeName = (name: string, dir?: string) =>
  fullName(name.replace(".jpg", `-large.jpg`), dir);

export const smallName = (name: string, dir?: string) =>
  fullName(name.replace(".jpg", `-small.jpg`), dir);

export const fullName = (name: string, dir?: string) =>
  join(dir || OUT_POST_PICS_DIR, name);
