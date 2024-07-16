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
  Deno.writeFileSync(
    "./lib/search/searchIndex.json",
    new TextEncoder().encode(JSON.stringify(index.toJSON())),
  );
};
