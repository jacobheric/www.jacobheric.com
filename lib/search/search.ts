// @deno-types="https://deno.land/x/fuse@v6.4.1/dist/fuse.d.ts"
import Fuse from "https://deno.land/x/fuse@v6.4.1/dist/fuse.esm.min.js";
import { parsePosts, posts } from "@/lib/posts.ts";
import { searchOptions } from "@/lib/search/createIndex.ts";

// import indexJson from "./searchIndex.json" with { type: "json" };
// import { searchOptions } from "@/lib/search/createIndex.ts";
// import { parsePosts, posts } from "@/lib/posts.ts";
// const index = Fuse.parseIndex(indexJson);
// // initialize Fuse with the index
// const fuse = new Fuse(books, searchOptions, index);

const p = await parsePosts(posts());
const fuse = new Fuse(p, searchOptions);

export const search = (term: string) => {
  const result = fuse.search(term);
  return result.map((r) => r.item);
};
