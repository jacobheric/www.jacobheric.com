import fuzzysort from "npm:fuzzysort";
import { db, PostType } from "../posts/posts.ts";

export const o = {
  threshold: .3,
  keys: ["title", "content"],
};

export const search = async (term: string) => {
  const iter = db.list<PostType>({ prefix: ["posts"] }, { limit: 1000 });

  const posts = [];
  for await (const p of iter) {
    posts.push(p.value);
  }
  console.log("shit posts");
  const results = fuzzysort.go(term, posts, o);
  return results.map(({ obj }) => obj);
};
