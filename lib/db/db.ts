import { existsSync } from "@std/fs";

export const PICTURES_INDEX = "./lib/db/pictures.json";
export const POSTS_INDEX = "./lib/db/posts.json";

export const pictureIndex = () =>
  existsSync(PICTURES_INDEX)
    ? JSON.parse(Deno.readTextFileSync(PICTURES_INDEX))
    : {};

export const postsIndex = () =>
  existsSync(POSTS_INDEX) ? JSON.parse(Deno.readTextFileSync(POSTS_INDEX)) : {};
