import fuzzysort from "npm:fuzzysort";
import { POSTS } from "../posts/posts.ts";

export const o = {
  threshold: .3,
  keys: ["title", "content"],
};

export const search = (term: string) => {
  const results = fuzzysort.go(term, POSTS.value, o);
  return results.map(({ obj }) => obj);
};
