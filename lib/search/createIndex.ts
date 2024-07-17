// @deno-types="https://deno.land/x/fuse@v6.4.1/dist/fuse.d.ts"
import Fuse from "https://deno.land/x/fuse@v6.4.1/dist/fuse.esm.min.js";
import { parsePosts, posts } from "../posts/posts.ts";

export const searchOptions = {
  threshold: .4,
  keys: [{ name: "title", weight: 2 }, "content", "slug"],
};

export const createIndex = async () => {
  const p = await parsePosts(posts());
  const index = Fuse.createIndex(searchOptions.keys, p);

  Deno.writeTextFileSync(
    "./lib/search/searchIndex.json",
    JSON.stringify(index.toJSON()),
  );
};

export const readIndex = async () => {
  const raw = Deno.readTextFileSync(
    "./lib/search/searchIndex.json",
  );
  const index = Fuse.parseIndex(raw);
  const p = await parsePosts(posts());
  return new Fuse(p, searchOptions, index);
};

// console.info("creating search Index...");
// await createIndex();
// console.info("done");
