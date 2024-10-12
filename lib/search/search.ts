import fuzzysort from "npm:fuzzysort";
import { PostType } from "../posts/posts.ts";
import { db } from "@/lib/db.ts";

export const o = {
  threshold: .3,
  keys: ["title", "content"],
};

export const search = async (term: string) => {
  const iter = db.list<PostType>({ prefix: ["posts"] }, {
    limit: 1000,
    consistency: "eventual",
  });

  const posts = [];
  for await (const p of iter) {
    posts.push(p.value);
  }
  const results = fuzzysort.go(term, posts, o);
  return results.map(({ obj }) => obj);
};
