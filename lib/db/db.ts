import { existsSync } from "@std/fs";
import { join } from "@std/path/join";

export const PICTURES_INDEX = join(Deno.cwd(), "lib/db/pictures.json");
export const POSTS_INDEX = join(Deno.cwd(), "lib/db/posts.json");

export const pictureIndex = () =>
  existsSync(PICTURES_INDEX)
    ? JSON.parse(Deno.readTextFileSync(PICTURES_INDEX))
    : {};

export const postsIndex = () =>
  existsSync(POSTS_INDEX) ? JSON.parse(Deno.readTextFileSync(POSTS_INDEX)) : {};
