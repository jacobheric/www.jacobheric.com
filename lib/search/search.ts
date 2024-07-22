import { parsePosts, sortedPosts } from "../posts/posts.ts";
import fuzzysort from "npm:fuzzysort";

export const o = {
  threshold: .3,
  keys: ["title", "content"],
};

const p = await parsePosts(sortedPosts());

export const search = (term: string) => {
  const results = fuzzysort.go(term, p, o);
  return results.map(({ obj }) => obj);
};
